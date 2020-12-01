/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';

import { observer, inject } from 'mobx-react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text , Circle} from 'react-konva';
import Konva from 'konva';
import * as cabinetService from './cabinetService';
import { trace, observable } from 'mobx';
import ContainerModel from './ContainerModel';
import { CabinetStore } from './CabinetStore';

interface ContainerViewProps {
    key: string;
    container: ContainerModel;
    store: CabinetStore;
    ratio: number;
    shiftX: number;
    shiftY: number;
}
interface ContainerViewState {}

@observer
export default class ContainerView extends React.Component<ContainerViewProps,ContainerViewState> {
   rect: Konva.Rect;
  


   constructor(props: any) {
       super(props);    
   }
   componentDidMount() {

       
       
   }
      handleClick = (e: any) => {
          e.target.setAttrs({
            //   shadowOffset: {
            //       x: 15,
            //       y: 15,
            //   },
              scaleX: 1.0,
              scaleY: 1.0,
          //fill: "blue",
          });
          this.props.store.selectedId=this.props.container.id;
         
          this.props.store.changeLock(this.props.container.id);
      };
      render() {
         
          return (       
              <React.Fragment>   
           
          
                  <Rect
                      x={this.props.container.x*this.props.ratio+this.props.shiftX}
                      y={this.props.container.y*this.props.ratio}
                      width={this.props.container.width*this.props.ratio}
                      height={this.props.container.height*this.props.ratio}
                      fill={this.props.container.Color}
                      shadowBlur={2}
                      stroke= {this.props.container.StrokeColor}
                      strokeWidth= {2}
                      cornerRadius= {2}
                      ref={node => {
                          this.rect = node;
                      }}
                      onClick={this.handleClick}
                  /> 
                  <Text
                      x={this.props.container.x*this.props.ratio+5+this.props.shiftX}
                      y={this.props.container.y*this.props.ratio+5}
                      text= {this.props.container.DisplayName}
                      fontSize={12}
                      fontFamily={'Calibri'}
                      fill={this.props.container.TextColor}
                  />
              </React.Fragment>          
             
          );
      }
} 

