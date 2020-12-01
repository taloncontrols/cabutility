import axios from 'axios';
import ContainerModel,{IContainer} from './ContainerModel'
import { getAuthorizationHeader } from '../authentication/authenticationHelper';
const TEST_CABINETSERVICE_URL = 'http://localhost:5009';

import * as signalR from "@microsoft/signalr";


var counter=0;


   

   
export  function GetContainers() : IContainer[] {
       counter++;
      
       var containers=[];
       if (counter%2==0){
            let data={id: "1", type:"Cabinet", parentId: "0",  x: 0, y: 0, width: 550, height: 600};
            containers.push(data);
            let data2={id: "1", type:"Cabinet", parentId: "1",  x: 30, y: 130, width: 250, height:300};
            containers.push(data2);
       }
       else{
        let data={id: "1", type:"Cabinet",  parentId: "0",  x: 0, y: 0, width: 550, height: 600};
        containers.push(data);
        let data2={id: "1", type:"Cabinet",  parentId: "1", x: 30, y: 130, width: 150, height:200};
        containers.push(data2);
       }
       
       return containers;
}

export async function change(id: string, value: string) {
    var item={id: id, value: value};
    var items=[];
    items.push(item);
    try {
        const response = await axios.patch(TEST_CABINETSERVICE_URL+'/ios/direct', items);
        console.log('Returned data:', response);
      } catch (e) {
        console.log(`Axios request failed: ${e}`);
      }
}

     
export async function  getContainersFromServer(): Promise<any> {
        return axios.get<any>(TEST_CABINETSERVICE_URL+'/containers').then((response) => {
            return response.data;
        });
}

export async function  getIosFromServer(): Promise<any> {
    return axios.get<any>(TEST_CABINETSERVICE_URL+'/ios/all').then((response) => {
        return response.data;
    });
}
    