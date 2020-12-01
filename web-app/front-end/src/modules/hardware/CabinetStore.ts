/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */

import { observable } from 'mobx';
import {action} from 'mobx';
import * as cabinetService from './cabinetService';
import ContainerModel from './ContainerModel';
import {IoItem,IoModel} from './ContainerModel';
import * as signalR from '@microsoft/signalr';
import _ from 'lodash';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';

export class CabinetStore {
	
    @observable containers: ContainerModel[]=[];
    @observable ios: IoModel[]=[];
    @observable  selectedId: string = null;
    @observable hubConnection?: signalR.HubConnection;

    constructor() {       
        this.loadData();
        this.createHubConnection();
    }
    @action
    loadData(){      
        var _this=this;
        cabinetService.getContainersFromServer().then((containers: any) => {
            _this.fillContainer(containers);
            cabinetService.getIosFromServer().then((ios: any) => {
                _this.fillIo(ios);
            });           
        }); 
        
    }
    
    fillContainer(containers: any){
        if (this.containers.length==0){
            for (var i=0; i< containers.length; i++)
                this.containers.push(new ContainerModel(containers[i]));           
        }
        else{//compare
            if (this.containers.length==containers.length){
                for (var i=0; i< containers.length; i++){
                    this.containers[i].Modify(containers[i]);    
                }
            }
        }
    }

    fillIo(ios: any){
        if (this.ios.length==0){
            for (var i=0; i< ios.length; i++)
               
                this.ios.push(new IoModel(ios[i]));       
                this.UpdateContainerValue(this.ios[this.ios.length-1]);    
        }
        else{//compare
            if (this.ios.length==ios.length){
                for (var i=0; i< ios.length; i++){
                    this.ios[i].Modify(ios[i]);    
                    this.UpdateContainerValue(this.ios[i]);    
                }
            }
        }
    }

    @action createHubConnection(): void {
        this.stopHubConnection();
        this.setUpSignalRConnection().then((con) => {
            this.hubConnection = con;
            });

        
    }

    @action stopHubConnection(): void {
        this.hubConnection?.stop();
    }

    setUpSignalRConnection = async () => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5009/cabhub')
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
        connection.on('ReceiveMessage',  (user: string, message: string)=> {
            const encodedMsg = user + ' says ' + message;
            console.log('Message', encodedMsg);
        });     
        connection.on('UpdateIoItem',  (ioItem: IoItem) =>{
            const encodedMsg = ioItem.id + ' ' + ioItem.value + ' ' + ioItem.valueType + ' ' + ioItem.containerId + ' ' + ioItem.type;
            console.log('Message', encodedMsg);
            this.UpdateIoItem(ioItem);
        });
        connection.on('UpdateIoItems',  (ioItems: IoItem[]) =>{
            ioItems.map((item,index) =>{
                const encodedMsg = item.id + ' ' + item.value + ' ' + item.valueType + ' ' + item.containerId + ' ' + item.type;
                console.log('Message', encodedMsg);
            });
        });
        try {
            await connection.start();
        } catch (err) {
            console.log(err);
        }
    
        if (connection.state === signalR.HubConnectionState.Connected) {
            connection.invoke('SendMessage','user','test').catch((err: Error) => {
                return console.error(err.toString());
            });
        }
    
        return connection;
    };

    @action
    UpdateIoItem (ioItem: IoItem) : void {
      
        
        let io=_.find(this.ios,function(o) { return o.id ==ioItem.id; });
        if (io !=undefined){
            io.value=ioItem.value;
            this.UpdateContainerValue(io);
        }
       
    }
   
    UpdateContainerValue(io: IoModel) : void {
        let container=_.find(this.containers,function(o) { return o.id ==io.containerId; });
        if (container!=undefined && (io.type=='lock'|| io.type=='closed')){
            container.value=io.value;
        }
    }
    /* public changeLock(containerId: string): void {
        
        let found=false;
        let ioId=null;
        let value=null;
        
        for (var i=0; i< this.ios.length; i++){
            if (this.ios[i].containerId==containerId){
                found= true;
                ioId=this.ios[i].id;
                value=this.ios[i].value;
                break;
            }
        }
        if (found){
            if (value=='0'){
                value='1';
            }
            else{
                value='0';
            }
            cabinetService.change(ioId, value);
        }
    } */
     public changeLock(containerId: string): void {
        let value=null;
        let io=_.find(this.ios,function(o) { return o.containerId ==containerId; });
        if (io){
            if (io.value=='0'){
                value='1';
            }
            else{
                value='0';
            }
            cabinetService.change(io.id, value);
        }        
    } 
    public change(ioId: string, value: string): void {
        cabinetService.change(ioId, value);
    }
}

