/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import { RouterStore } from 'mobx-react-router';
import { AuthenticationStoreClass } from '../authentication/AuthenticationStore';
import ContainerModel, {IoItem, IoModel }  from './ContainerModel';
import { CabinetStore }  from './CabinetStore';
import ContainerView from './ContainerView';
import logo from '../../static/images/light_logo.svg';
import './Cabinet.scss';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { isNull } from 'lodash';
import _ from 'lodash';

export interface CabinetProps {
    authenticationStore?: AuthenticationStoreClass;
    routingStore?: RouterStore;  
    store: CabinetStore;
}



@inject("authenticationStore", "routingStore")
@observer
export default class Cabinet extends React.Component<CabinetProps> {
  private Message = "Please select your compartment.";

  constructor(props: never) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log("Cabinet componentDidMount 5009");
  }

  public render() {
    let ratio = 1;
    let containers: ContainerModel[] = [];
    let innerWidth = 250;
    let innerHeight = 450;
    let subcontainers: ContainerModel[] = [];
    let ios: IoModel[] = [];

    let cabinetStore = this.props.store;
    if (cabinetStore.containers.length > 0) {
      if (innerWidth > 100 && innerHeight > 100) {
        const ratio1 = (innerWidth * 1.0) / cabinetStore.containers[0].width;
        const ratio2 = (innerHeight * 1.0) / cabinetStore.containers[0].height;
        if (ratio1 > ratio2) {
          ratio = ratio2;
        } else {
          ratio = ratio1;
        }
      }
      const id = cabinetStore.containers[0].id;
      containers = cabinetStore.containers.filter(
        (container) => container.id == id || container.parentId == id
      );
      var selectedId = cabinetStore.selectedId;
      var secondId = selectedId;
      var selectedContainers = cabinetStore.containers.filter(
        (container) => container.id == selectedId
      );
      if (selectedContainers.length > 0) {
        if (selectedContainers[0].type == "pocket")
          secondId = selectedContainers[0].parentId;
        //if (selectedContainers[0].type=='drawer')
        else {
          var childContainers = cabinetStore.containers.filter(
            (container) => container.parentId == selectedId
          );
          if (childContainers.length == 1) {
            secondId = childContainers[0].id;
          }
        }
      }
      if (secondId != null && secondId != id) {
        subcontainers = cabinetStore.containers.filter(
          (container) =>
            container.id == secondId || container.parentId == secondId
        );
      }

      ios = cabinetStore.ios;
      return (
        <div className=" cabinet">
          <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">name</th>
                  <th scope="col">type</th>
                  <th scope="col">value</th>
                  <th scope="col">range</th>
                  <th scope="col">description</th>
                </tr>
              </thead>
              <tbody>
                {ios.map((io, index) => (
                  <tr key={io.id}>
                    <th scope="row">{io.containerId}</th>
                    <td>{io.name}</td>
                    <td>{io.type}</td>
                    <td>
                      <input
                        type="text"
                        className="iotext"
                        value={io.value}
                        onChange={(e) => this.handleChange(io.id, e)}
                      />
                    </td>
                    <td>{io.range}</td>
                    <td>{io.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <Stage width={3 * innerWidth} height={innerHeight}>
              <Layer>
                <React.Fragment>
                  {containers.map((container, index) => (
                    <ContainerView
                      key={container.id}
                      container={container}
                      store={cabinetStore}
                      shiftX={0}
                      shiftY={0}
                      ratio={ratio}
                    />
                  ))}
                </React.Fragment>
                <React.Fragment>
                  {subcontainers.map((container, index) => (
                    <ContainerView
                      key={container.id}
                      container={container}
                      store={cabinetStore}
                      shiftX={innerWidth + 10}
                      shiftY={0}
                      ratio={ratio}
                    />
                  ))}
                </React.Fragment>
              </Layer>
            </Stage>
          </div>
        </div>
      );
    }
    return <div></div>;
  }

  handleChange(id: string, event: React.ChangeEvent<HTMLInputElement>) {
    //this.setState({value: event.target.value});
    let io = _.find(this.props.store.ios, function (o) {
      return o.id == id;
    });
    if (io != undefined) {
      io.value = event.target.value;
      this.props.store.change(id, io.value);
    }
  }

  private OnCancel() {
    //this.setState( {IsLoggedIn: false, Message2: this.Message1, Message1: "" });
    //this.props.Svc.Logout();
    console.log("logout ");
    this.props.authenticationStore.logout();
    this.props.routingStore.push("/keypad");
    // this.props.authenticationStore.authenticateByPin()
    //    .then(() => this.props.routingStore.push('/keypad'));
  }
} // Cabinet
