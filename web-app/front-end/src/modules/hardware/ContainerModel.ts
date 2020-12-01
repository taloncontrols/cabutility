/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {observable, computed} from 'mobx';

export class IoItem{

    id: string;
    value: string;
    direction: string;
    valueType: string;
    containerId: string;
    type: string;
    deviceId: string;
    deviceChannel: number;
    scheduleId: string;
    name: string;
    range: string;
    description: string;
}
export class IContainer {
    id: string;  
    type: string;
    parentId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    

}
export class IoModel{

    @observable id: string;
    @observable value: string;
    @observable direction: string;
    @observable valueType: string;
    @observable containerId: string;
    @observable type: string;
    @observable deviceId: string;
    @observable deviceChannel: number;
    @observable scheduleId: string;
    @observable name: string;
    @observable range: string;
    @observable description: string;

    constructor(data: IoItem) {
        this.Update(data);
    }
    
    Modify(data: IoItem) {
        if (this.id==data.id){
            this.Update(data);
        }
    }
    private Update(data: IoItem) {
       
        this.id=data.id;
        this.value=data.value;       
        this.direction=data.direction;
        this.valueType=data.valueType;
        this.containerId=data.containerId;
        this.type=data.type;
        this.deviceId=data.deviceId;
        this.deviceChannel=data.deviceChannel;
        this.scheduleId=data.scheduleId;
        this.name=data.name;
        this.range=data.range;
        this.description=data.description;

        if (this.value==null){
            this.value='';
        }
        
    }
}

export default class ContainerModel {
    @observable id: string;   
    @observable type: string;
    @observable parentId: string;   
    @observable x: number;
    @observable y: number;
    @observable width: number;
    @observable height: number;

    @observable value: string;   
    

    constructor(data: IContainer) {
        this.Update(data);
    }
    
    Modify(data: IContainer) {
        if (this.id==data.id){
            this.Update(data);
        }
    }
    private Update(data: IContainer) {
       
        this.id=data.id;
        this.type=data.type;
        this.parentId=data.parentId;
        this.x=data.x;
        this.y=data.y;
        this.width=data.width;
        this.height=data.height;
        
    }

    @computed get DisplayName() {
        if (this.type=='pocket')
            return this.id;
        return this.type+ ' '+ this.id ;
    }
    
    @computed get Color() {
        
            return 'white';
        
    }

    @computed get StrokeColor() {
        if (this.value=='0'){
            return 'red';
        }
        else{
            return 'black';
        }
    }

    @computed get TextColor() {
        if (this.value=='0'){
            return 'red';
        }
        else{
            return 'black';
        }
    }
}
