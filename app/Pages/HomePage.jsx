
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
//ui组件
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlipMove from 'react-flip-move'
//内部组件
import Header from '../component/HomePage/Header';
import Topics from '../component/HomePage/topics';
import DataService from '../service/dataService.js'
import MyDrawer from '../component/HomePage/drawer';
import './Page.less';

import {Add_all_topics,Add_good_topics,Add_share_topics,Add_ask_topics,Add_job_topics,Switch_show} from '../action/action.js'
import getSize from '../service/util.js';
class HomePage extends Component{
    constructor(){
        super();
        this.state={
            // charpters:['全部','精华','分享','问答','招聘'],
            charpters:[{text:'全部',tab:'all'},{text:'精华',tab:'good'},{text:'分享',tab:'share'},{text:'问答',tab:'ask'},{text:'招聘',tab:'job'}],
            test:0,
            topics:[],
            pageIndex_all:1,
            pageIndex_good:1,
            pageIndex_share:1,
            pageIndex_ask:1,
            pageIndex_job:1,
            openDrawer:false
        }
    }
    selectedTab='all';
    fetching=false;
    componentDidMount(){
        this.loadMore('all',1);
        window.onscroll = () => {
            if(!this.fetching){
                this.loadMore(this.selectedTab);

            }
        }
    }
    componentWillUnmount(){
        window.onscroll=null;
    }
    handleTabsChange=(value)=>{
        
        const {dispatch,topics}=this.props;
        
        this.selectedTab=value;

        dispatch(Switch_show(value))
        if(!this.fetching){
            this.loadMore(value)
        }
        
    }
    loadMore=(tab,index)=>{
       

        let {windowH,contentH,scrollT} = getSize();
        
        
        if((windowH + scrollT + 100 > contentH)||this.state['pageIndex_'+tab]===1){
            this.loadData(tab)
        }
    }
    
    loadData=(tab)=>{
        this.fetching=true;
        
        const {dispatch} =this.props;
        switch(tab){
            case 'all':{
                let index=this.state.pageIndex_all;
                DataService.getTopic(index,tab).then(res=>{
                    dispatch(Add_all_topics(res.data));
                    this.setState({pageIndex_all:index+1},()=>{
                        this.fetching=false;
                    });
                    
                })
            };break;
            case 'share':{
                let index=this.state.pageIndex_share;
                DataService.getTopic(index,tab).then(res=>{
                    dispatch(Add_share_topics(res.data));
                    this.setState({pageIndex_share:index+1},()=>{
                        this.fetching=false;
                    });
                    
                })
            };break;
             case 'good':{
                let index=this.state.pageIndex_good;
                DataService.getTopic(index,tab).then(res=>{
                    dispatch(Add_good_topics(res.data));
                    this.setState({pageIndex_good:index+1},()=>{
                        this.fetching=false;
                    });
                    
                })
            };break; 
            case 'ask':{
                let index=this.state.pageIndex_ask;
                DataService.getTopic(index,tab).then(res=>{
                    dispatch(Add_ask_topics(res.data));
                    this.setState({pageIndex_ask:index+1},()=>{
                        this.fetching=false;
                    });
                    
                })
            };break; 
            case 'job':{
                let index=this.state.pageIndex_job;
                DataService.getTopic(index,tab).then(res=>{
                    dispatch(Add_job_topics(res.data));
                    this.setState({pageIndex_job:index+1},()=>{
                        this.fetching=false;
                    });
                    
                })
            };break;
            default:break;
        }
    }
    toggleDrawer=()=>{
        this.setState({openDrawer:!this.state.openDrawer})
    }
    render(){
        const {test,charpters}=this.state;
        let enterAnimation = {
            from: { transform: 'translateY(-80px)',opacity:0 },
            to:   { transform: 'translateY(0)',opacity:1 }
        }
        const {topics,login}=this.props;

        return(
            
            <MuiThemeProvider>
                <div className="homepage">
                    <Header toggleDrawer={this.toggleDrawer}></Header>
                    <Tabs onChange={this.handleTabsChange} >
                        {charpters.map((item,index)=>{
                                return (<Tab key={index} label={item.text} value={item.tab}>
                                  
                                       
                                    </Tab>)
                        })}

                    </Tabs>
                    <FlipMove  enterAnimation={enterAnimation} easing='ease-out' duration='400' staggerDelayBy='40' staggerDurationBy='4'>
                            <Topics  />
                    </FlipMove>

                    <MyDrawer openDrawer={this.state.openDrawer} toggleDrawer={this.toggleDrawer} succed={login.succed}></MyDrawer>
                    
                </div>
            </MuiThemeProvider>
        )
    }
}
const mapStateToProps=(state)=>{
    const {topics,login}=state;

    return {topics,login}
}
export default connect(mapStateToProps)(HomePage);