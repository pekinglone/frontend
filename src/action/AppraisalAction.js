import 'isomorphic-fetch';
import { SET_TEMPLATE_TYPE, SET_KPI_TITLE, SET_KPI_DETAIL, SET_JUDGED_PEOPLE, SET_USER_INFO, SET_MENU_STATUS, HIDDEN_MODAL, SHOW_MODAL, SET_TEMPLATE, SET_MENU, SET_APPRAISAL_TEMPLATETYPE_STATUS, SET_GROUP_TITLE, SET_DATA_SOURCE, SET_PERSON_TITLE, SET_UNCOMPLETED_TEMPLATE, SET_CURRENT_GROUP } from '../constants/AppraisalConstants.js';
const commonUrl = 'backend:8080';//assessment.backend.pepris.com:80';//10.225.1.51:30889';//10.225.51.151:8080';
export function setUserInfo(userId){
  return {
    type: SET_USER_INFO,userId
  }
}
export function selectType(value){
  return {
    type: SET_MENU_STATUS, value
  }
}
export function hiddenModal(){
	return{
		type: HIDDEN_MODAL
	}
}
export function showModal(content){
	return{
		type: SHOW_MODAL, content
	}
}
function setTemplate(template){
	return {
		type: SET_TEMPLATE, template
	}
}
function setMenu(detail) {
	return {
		type: SET_MENU, detail
	}
}
export function setTemplateTypeStatus(status) {
	return {
		type: SET_APPRAISAL_TEMPLATETYPE_STATUS, status
	}
}
export function setGroupTtile(groupTitle){
	return {
		type: SET_GROUP_TITLE, groupTitle
	}
}
export function setPersonTtile(personTitle){
	return {
		type: SET_PERSON_TITLE, personTitle
	}
}
export function setDataSource(data){
	return {
		type: SET_DATA_SOURCE, data
	}
}
function setUncompletedTemplate(data){
	return {
		type: SET_UNCOMPLETED_TEMPLATE, data
	}
}
export function setCurGroup(group){
	return {
		type: SET_CURRENT_GROUP, group
	}
}
function setJudgedPeopleList(data){
	return {
		type: SET_JUDGED_PEOPLE, data
	}
}
export function setPeopleKpiDetail(data){
	return {
		type: SET_KPI_DETAIL, data
	}
}
function setKpiTitle(data){
	return {
		type: SET_KPI_TITLE, data
	}
}
export function setTemplateType(mblx){
	return {
		type:　SET_TEMPLATE_TYPE, mblx
	}
}
export function asyncGetMenu(pwid) {
	return function(dispatch){//dispatch
    // API
	    return fetch('/getMenu?userid=' + pwid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	// console.log(data);
	    	if(data !== undefined || data !== []){
	    		let dataTemp = {};
	    		data.forEach((item) => {
	    			dataTemp[item.KHFAID] = item.KHFAMC;
	    		});
	    		dispatch(setMenu(dataTemp));
	    		const khfaid = data[0].KHFAID;
	    		dispatch(asyncGetTemplateType(pwid, khfaid));
	    		let resTemp = {};
	    		data.forEach((item, index) => {
	    			if(index === 0){
	    				resTemp[item.KHFAID] = true;
	    			} else {
	    				resTemp[item.KHFAID] = false;
	    			}
	    		});
	    		dispatch(selectType(resTemp));
	    	}
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncGetTemplateType(pwid, khfaid) {
	return function(dispatch){//dispatch
    // API
	    return fetch('/getTemplate?userid=' + pwid + '&khfaid=' + khfaid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data !== undefined || data !== []){
    		dispatch(setTemplate(data));
    		let resTemp = {};
    		let mbid = 0;
    		let mblx = 0;
    		data.forEach((item, index) => {
    			if(index === 0){
    				resTemp[item.MBLXID] = true;
    				mbid = item.MBLXID;
    				mblx = item.MBTYPE;
    			} else {
    				resTemp[item.KHMBID] = false;
    			}
    		});
    		dispatch(setTemplateType(mblx));
    		dispatch(asyncGetTemplate(pwid, khfaid, mbid));
    		dispatch(setTemplateTypeStatus(resTemp));
    		// dispatch(asyncGetUncompletedTemplate(pwid, khfaid, mblx));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
// test
export function asyncGetItems(pwid, khfaid, khmblx, khmbid) {
	return function(dispatch){//dispatch
    // API
	    return fetch('/getItems?userid=' + pwid + '&khfaid=' + khfaid + '&mblxid=' + khmblx+ '&khmbid=' + khmbid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data !== undefined || data !== []){
	      	if(khmblx === "1"){
	      		dispatch(setGroupTtile(data));
	      	} else if(khmblx === "5" || khmblx === "2"){
	      		dispatch(setPersonTtile(data));
	      	} else if(khmblx === "3"){
	      		dispatch(setKpiTitle(data));
	      	}
    		
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncGetDetail(pwid, khfaid, khmblx, khcsid, groupSet) {
	return function(dispatch){//dispatch
    // API
	    return fetch('/getGroupItemsName?userid=' + pwid + '&khfaid=' + khfaid + '&mblxid=' + khmblx + '&khcsid=' + khcsid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data !== undefined || data !== []){
	      	if(khfaid === "1" && khmblx ==="1"){
	      		data.forEach((item) => {
		      		Object.keys(groupSet).forEach((key) => {
		      			if(groupSet[key] === khcsid){
		      				item["group"] = key;
		      			}
		      		});
		      	});
	      	}	      	
    		dispatch(setDataSource(data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncPersonGetDetail(pwid, khfaid, khmblx, khmbid) {
	return function(dispatch){//dispatch
    // API
	    return fetch('/getPerItems?userid=' + pwid + '&khfaid=' + khfaid + '&mblxid=' + khmblx + '&khmbid=' + khmbid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data !== undefined || data !== []){
    		dispatch(setDataSource(data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}

export function asyncSaveScore(pwid, khfaid, khmblx, khmbid, value) {
	// khmblx = 1;
	return function(dispatch){//dispatch
    // API：
	    return fetch('/saveScore?userid=' + pwid + '&khfaid=' + khfaid + '&mblxid=' + khmblx,{//} + '&khmbid=' + khmbid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
    		dispatch(asyncGetUncompletedTemplate(pwid, khfaid, khmblx));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncGetUncompletedTemplate(pwid, khfaid, khmblx) {
	khmblx = 1;
	return function(dispatch){//dispatch
    // API：
	    return fetch('/isScoreCompleted?userid=' + pwid + '&khfaid=' + khfaid + '&mblxid=' + khmblx,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
    		dispatch(setUncompletedTemplate(data));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncGetPersonList(pwid, khfaid, khmblx, khmbid) {
	return function(dispatch){//dispatch
    // API：
	    return fetch('/getVUsers?userid=' + pwid + '&khfaid=' + khfaid + '&khmblx=' + khmblx + '&khmbid=' + khmbid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); 
	    }).then(function(data){
    		dispatch(setJudgedPeopleList(data));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncPeopleKpiDetail(pwid, khfaid, khmblx, khmbid, Dxid) {
	return function(dispatch){//dispatch
    // API：
	    return fetch('/getVGroupItemsName?userid=' + pwid + '&khfaid=' + khfaid + '&khmblx=' + khmblx + '&khmbid=' + khmbid + '&khdxid=' + Dxid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
    		dispatch(setPeopleKpiDetail(data));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncGetTemplate(userid, khfaid, mblxid, mbtype) {
	return function(dispatch){//dispatch
    // API：
	    return fetch('/getMbidsByPw?userid=' + userid + '&khfaid=' + khfaid + '&mblxid=' + mblxid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	// if(mbtype === "1"){
	    	// 	// dispatch(asyncGetItems());
	    	// }
	    	// if(mbtype === "2"){
	    	// 	// dispatch(setJudgedPeopleList());
	    	// }
	    	// if(mbtype === "3"){
	    	// 	dispatch(setJudgedPeopleList());
	    	// }
    		// dispatch(setPeopleKpiDetail(data));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}