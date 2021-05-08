import 'isomorphic-fetch';
import { SET_USER_INFO, SET_CURRENT_PROGRAMID, SET_CURRENT_TEMPLATETYPEID, SET_PROGRAM_AND_TEMPLATETYPE, SET_MB_TYPE } from '../constants/AppraisalNewConstants.js';
import { SET_TEMPLATE_AND_OBJECT, SET_CURRENT_TEMPLATEID, SET_CURRENT_OBJECTTYPE, SET_CURRENT_OBJECTID, SET_SELECTED_KEYS } from '../constants/AppraisalNewConstants.js';
import { SET_CURRENT_STATUS, HIDDEN_MODAL, SHOW_MODAL, SET_GROUP_TITLE, SET_PERSON_TITLE, SET_KPI_TITLE, SET_DATA_SOURCE, SET_UNCOMPLETED_TEMPLATE } from '../constants/AppraisalNewConstants.js';
const commonUrl = 'http://assessment.backend.pepris.com';//assessment.backend.pepris.com:80';//10.225.1.51:30889';//10.225.51.151:8080';
export function setCurrentProgramId(programId){
	return {type: SET_CURRENT_PROGRAMID, programId}
}
export function setCurrentTemplateTypeId(templateTypeId){
	return {type: SET_CURRENT_TEMPLATETYPEID, templateTypeId}
}
export function setProgramAndTemplateType(data){
	return {type: SET_PROGRAM_AND_TEMPLATETYPE, data}
}
export function serCurrentMbType(mbtype){
	return {type: SET_MB_TYPE, mbtype}
}
export function asyncGetProgramAndTemplateType(pwid) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getMblxsByPw?userid=' + pwid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	if(data.status === "success"){
	    		dispatch(setProgramAndTemplateType(data.data));
	    		dispatch(setCurrentProgramId(data.data[0].KHFAID));
	    		sessionStorage.setItem("currentProgramId", data.data[0].KHFAID);
	    		if(data.data[0].MBLXS.length > 0){
	    			sessionStorage.setItem("currentTemplateTypeId", data.data[0].MBLXS[0].MBLXID);
	    			sessionStorage.setItem("currentMbType", data.data[0].MBLXS[0].MBTYPE);
	    			dispatch(serCurrentMbType(data.data[0].MBLXS[0].MBTYPE));
	    			dispatch(setCurrentTemplateTypeId(data.data[0].MBLXS[0].MBLXID));


	    			// ==========================
	    			dispatch(asyncGetTemplateAndObject(pwid, data.data[0].KHFAID, data.data[0].MBLXS[0].MBLXID));




	    		}
	    	}
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function setUserInfo(userId){
  return {
    type: SET_USER_INFO,userId
  }
}
export function setTemplateAndObject(data){
	return {
    type: SET_TEMPLATE_AND_OBJECT,data
  }
}
export function setcurrentTemplateId(templateId){
	return {
    type: SET_CURRENT_TEMPLATEID, templateId
  }
}
export function setCurrentObjectType(objectType){
	return {
    	type: SET_CURRENT_OBJECTTYPE, objectType
  	}
}
export function setCurrentObjectId(currentObjectId){
	return {
    	type: SET_CURRENT_OBJECTID, currentObjectId
  	}
}
export function asyncGetTemplateAndObject(userid, khfaid, mblxid) {
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/getMbidsByPw?userid=' + userid + '&khfaid=' + khfaid + '&mblxid=' + mblxid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	if(data.status === "success"){
	    		dispatch(setTemplateAndObject(data.data));
	    		dispatch(setcurrentTemplateId(data.data[0].KHMBID));
	    		let SelectedKeys = [];
	    		SelectedKeys.push(data.data[0].KHMBID);
	    		dispatch(setSelectedKeys(SelectedKeys));
	    		sessionStorage.setItem("currentTemplateId", data.data[0].KHMBID);
    			// ======================
			    const mbtype = sessionStorage.getItem("currentMbType");
			    dispatch(asyncGetItems(userid, khfaid, mblxid, data.data[0].KHMBID, mbtype));
	    		if(data.data[0].KHOBJECT.length > 0){
	    			dispatch(setCurrentObjectType(data.data[0].KHOBJECTTYPE));
	    			sessionStorage.setItem("currentObjectType", data.data[0].KHOBJECTTYPE);
	    			const currentObject = data.data[0].KHOBJECT[0];


	    			


	    			if(data.data[0].KHOBJECTTYPE === "1"){
	    				dispatch(setCurrentObjectId(currentObject.KHCSID));
	    				sessionStorage.setItem("currentObjectId", currentObject.KHCSID);


		    			// ======================
					    dispatch(asyncGetGroupTemplate(userid, khfaid, mblxid, currentObject.KHCSID));



	    			} else {
	    				if(mbtype === '2'){
					      dispatch(asyncPersonGetDetail(userid, khfaid, mblxid, data.data[0].KHMBID));
					    }
					    if(mbtype === '3'){
					      dispatch(asyncGetTemplateAndObject(userid, programId, mblxid));
					    }
	    			}
	    			
	    		}
	    	}
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
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
function setKpiTitle(data){
	return {
		type: SET_KPI_TITLE, data
	}
}
export function asyncGetItems(pwid, khfaid, mblxid, khmbid, mbtype) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getItems?userid=' + pwid + '&khfaid=' + khfaid + '&mblxid=' + mblxid+ '&khmbid=' + khmbid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data !== undefined || data !== []){
	      	if(mbtype === "1"){
	      		dispatch(setGroupTtile(data));
	      	} else if(mbtype === "2"){
	      		dispatch(setPersonTtile(data));
	      	} else if(mbtype === "3"){
	      		dispatch(setKpiTitle(data));
	      	}
    		
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function setDataSource(data){
	return {
		type: SET_DATA_SOURCE, data
	}
}
export function asyncGetGroupTemplate(pwid, khfaid, mblxid, khcsid) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getGroupItemsName?userid=' + pwid + '&khfaid=' + khfaid + '&mblxid=' + mblxid + '&khcsid=' + khcsid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
    		dispatch(setDataSource(data));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncPeopleKpiDetail(userid, khfaid, mblxid, khmbid, khdxid) {
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/getVGroupItemsName?userid=' + userid + '&khfaid=' + khfaid + '&mblxid=' + mblxid + '&khmbid=' + khmbid + '&khdxid=' + khdxid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
    		dispatch(setDataSource(data));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncPersonGetDetail(userid, khfaid, mblxid, khmbid) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getPerItems?userid=' + userid + '&khfaid=' + khfaid + '&mblxid=' + mblxid + '&khmbid=' + khmbid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
    		dispatch(setDataSource(data));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
function setUncompletedTemplate(data){
	return {
		type: SET_UNCOMPLETED_TEMPLATE, data
	}
}
export function asyncGetUncompletedTemplate(userid, khfaid, mblxid) {
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/isScoreCompleted?userid=' + userid + '&khfaid=' + khfaid + '&mblxid=' + mblxid,{
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
export function asyncSaveScore(userid, khfaid, mblxid, khmbid, value) {
	// khmblx = 1;
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/saveScore?userid=' + userid + '&khfaid=' + khfaid + '&mblxid=' + mblxid + '&khmbid=' + khmbid,{//} + '&khmbid=' + khmbid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
    		dispatch(asyncGetUncompletedTemplate(userid, khfaid, mblxid));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function showModal(content){
	return{
		type: SHOW_MODAL, content
	}
}
export function hiddenModal(){
	return{
		type: HIDDEN_MODAL
	}
}
export function setSelectedKeys(keys){
	return {
		type: SET_SELECTED_KEYS, keys
	}
}
export function setCurrentStatus(data){
	return {
		type: SET_CURRENT_STATUS, data
	}
}
export function asyncGetCurrentStatus(userid, khfaid, khmbid, mblxid){
	return function(dispatch){//dispatch
    // API
              
	    return fetch(commonUrl + '/getCurrentStatus?userid=' + userid + '&khfaid=' + khfaid + '&khmbid=' + khmbid + '&mblxid=' + mblxid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status !== 'success'){
	      	alert(data.message);
      	  }
      	  if(data.data && data.data.length > 0){
	      	data.data.forEach((item) => {
	      		item.key = item.DCBZID;
	      	});
	      }
      	  dispatch(setCurrentStatus(data.data));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}