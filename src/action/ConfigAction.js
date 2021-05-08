import 'isomorphic-fetch';
import {showModal} from './AppraisalNewAction';
import { SET_ALL_JUDGELIST, RESET_JUDGETESM_LIST, SET_CONFIG_TEMPLATE_STATUS, SET_TEMPLATETYPE_STATUS, SET_PROGRAM_STATUS, SHOW_JUDGE_LIST, HIDDEN_JUDGE_LIST, SET_JUDGE_LIST, SET_CURRENT_PWZID, SET_JUDGE_TEAM, SHOW_JUDGE_TEAMLIST, HIDDEN_JUDGE_TEAMLIST, SHOW_ADD_TEMPLATE, HIDDEN_ADD_TEMPLATE, SHOW_EDIT_TEMPLATE, HIDDEN_EDIT_TEMPLATE, SHOW_CREATE_TEMPLATE, HIDDEN_CREATE_TEMPLATE, SET_CURRENT_TEMPLATE, SET_TEMPLATE_LIST, SET_CURRENT_FAID, SET_PROGRAM_LIST, SET_FAXX_STATUS, SET_CURRENT_MBLXID, SET_CURRENT_MBLXMC, SET_CURRENT_MBLX, SET_DEP_LIST, SET_USER_LIST, SET_MAIN_PROCESS, SET_SUB_PROCESS, SET_EDITABLE_TABLEHEADER, SET_EDITABLE_TABLETYPE, INIT_TEMPLATE_TYPE } from '../constants/AppraisalConstants.js';
import { SET_MATCH_PROCESS, SET_PROGRAME_LIST, SET_DEP_BIND_PROGRAM, SET_OBJECT_BIND_PROGRAM, SET_BIND_PROGRAM, SET_TMPTYPE_LIST, BIND_TMPTYPE, BIND_TEMPLATE_TYPE, SET_TEMPLATE_COFIG, SET_RESULT, SET_SUB_MATCH, SET_NULL, SET_OBJECT_STATUS, SET_OBJECT_LIST, SET_ALLUSER_LIST, SET_ALLDEP_LIST } from '../constants/AppraisalConstants.js';
const commonUrl = 'http://assessment.backend.pepris.com';//assessment.backend.pepris.com:80';//10.225.1.51:30889';//10.225.51.151:8080';
export function resetJudgeTeamList(){
	return {
    type: RESET_JUDGETESM_LIST
  }
}
export function setMainProcess(process){
  return {
    type: SET_MAIN_PROCESS, process
  }
}
export function setNewProgramList(faList){
  return {
    type: SET_PROGRAM_LIST, faList
  }
}
export function setFaxxStatus(faxxstatus){
	return {
		type:SET_FAXX_STATUS,faxxstatus
	}
}
export function setSubProcess(process){
  return {
    type: SET_SUB_PROCESS, process
  }
}
function setallUserList(userList){
	return {
		type: SET_ALLUSER_LIST, userList
	}
}
function setallDepList(depList){
	return {
		type: SET_ALLDEP_LIST, depList
	}
}
function setUserList(userList){
	return {
		type: SET_USER_LIST, userList
	}
}
function setDepList(depList){
	return {
		type: SET_DEP_LIST, depList
	}
}
export function setEditableTableHeader(tableHeader){
	return {
		type: SET_EDITABLE_TABLEHEADER, tableHeader
	}
}
export function setEditableTableType(tableType){
	return {
		type: SET_EDITABLE_TABLETYPE, tableType
	}
}
export function setTemplateType(mblx){
	return {
		type: INIT_TEMPLATE_TYPE, mblx
	}
}
export function setCurrentMblxmc(mblxmc){
	return {
		type: SET_CURRENT_MBLXMC, mblxmc
	}
}
export function setCurrentMblxId(mblxid){
	return {
		type: SET_CURRENT_MBLXID, mblxid
	}
}
export function setCurrentMblx(mblx){
	return {
		type: SET_CURRENT_MBLX, mblx
	}
}
export function setCurrentFaId(faid){
	return {
		type: SET_CURRENT_FAID, faid
	}
}
function setTemplateList(value) {
	return {
		type: SET_TEMPLATE_LIST, value
	}
}
function setCurrentMb(currentMb) {
	return {
		type: SET_CURRENT_TEMPLATE, currentMb
	}
}
export function showAddTemplate(){
	return{ type: SHOW_ADD_TEMPLATE }
}
export function hiddenAddTemplate(){
	return{ type: HIDDEN_ADD_TEMPLATE }
}
export function showEditTemplate(){
	return{ type: SHOW_EDIT_TEMPLATE }
}
export function hiddenEditTemplate(){
	return{ type: HIDDEN_EDIT_TEMPLATE }
}
export function showCreateTemplate(){
	return{ type: SHOW_CREATE_TEMPLATE }
}
export function hiddenCreateTemplate(){
	return{ type: HIDDEN_CREATE_TEMPLATE }
}
export function showJudgeList(){
	return{ type: SHOW_JUDGE_LIST }
}
export function hiddenJudgeList(){
	return{ type: HIDDEN_JUDGE_LIST }
}
function setJudgeTeam(judgeList){
	return{ type: SET_JUDGE_TEAM, judgeList }
}
export function setJudgeList(judgeList){
	return {type: SET_JUDGE_LIST, judgeList}
}
export function showJudgeTeamList(){
	return{ type: SHOW_JUDGE_TEAMLIST }
}
export function hiddenJudgeTeamList(){
	return{ type: HIDDEN_JUDGE_TEAMLIST }
}
export function setCurrentPwzId(pwzid){
	return{ type: SET_CURRENT_PWZID, pwzid }
}
//  ========================= xiyu and xiaomei add on 2019/12/16 ======================
export function setMatchProcess(process){
  return {
    type: SET_MATCH_PROCESS, process
  }
}
export function setProgramList(programList){
	return {
		type: SET_PROGRAME_LIST, programList
	}
}
export function bindDepProgram(dep){
  return {
    type: SET_DEP_BIND_PROGRAM, dep
  }
}
export function bindObjectProgram(object){
  return {
    type: SET_OBJECT_BIND_PROGRAM, object
  }
}
export function bindProgram(program){
  return {
    type: SET_BIND_PROGRAM, program
  }
}
export function setTemplateTypeList(tmpTypeList){
	return {
		type: SET_TMPTYPE_LIST, tmpTypeList
	}
}
export function bindTemplate(template){
	return {
		type: BIND_TMPTYPE, template
	}
}
export function bindTemplateType(templatetype){
  return {
    type: BIND_TEMPLATE_TYPE, templatetype
  }
}
export function setTemplate(template){
	return{
		type:SET_TEMPLATE_COFIG, template
	}
}
export function setResult(khmbid, detail){
	return{
		type: SET_RESULT, khmbid, detail
	}
}
export function setSubMatch(process){
	return{
		type: SET_SUB_MATCH, process
	}
}
export function setAgain(result){
	return{
		type: SET_NULL, result
	}
}
function setObjectStatus(status){
	return {
		type: SET_OBJECT_STATUS, status
	}
}
function setObjectList(objectList){
	return {
		type: SET_OBJECT_LIST, objectList
	}
}
export function asyncGetAllDeps() {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getAllDeps',{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': 'backend'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data !== undefined || data !== []){
	      	data.forEach((item)=> {
	      		item.key = item.DEPID;
	      	});
	      	dispatch(setallDepList(data));
	      	// dispatch(setDepList(data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncGetAllUsers() {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getAllUsers',{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data !== undefined || data !== []){
	      	data.forEach((item)=> {
	      		item.key = item.USERID;
	      	});
	      	dispatch(setallUserList(data));
	      	// dispatch(setUserList(data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncSaveFaxx(value) {
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/addProgram',{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	if(data.status === "success"){
	    		dispatch(setNewProgramList(data.isNotExist));
	    		dispatch(setSubProcess(1));
	    		// dispatch(showModal("提交成功！"));
	    	}else{
	    		let info='';
	    		data.isExist.forEach(i=>{info=info+" "+i});
	    		alert("以下方案名称重复："+info+"，请修改");
	    	}
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncAddTemplateType(khfaid, value) {
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/addTemplateType?khfaid=' + khfaid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	if(data.status === "success"){
	    		if(data.isNotExist !== undefined){
	    			dispatch(setTemplateList(data.isNotExist));
	    		} else {
	    			dispatch(setTemplateList([]));
	    		}
	    		dispatch(setSubProcess(3));
	    	}else{
	    		let info='';
	    		data.isExist.forEach(i=>{info=info+" "+i});
	    		alert("以下模板类型名称重复："+info+"，请修改");
	    	}
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncNewTemplate(khfaid, mblxid, mbtype, khmbmc, value){
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/addTemplate?khfaid=' + khfaid + '&mblxid=' + mblxid + '&mbtype=' + mbtype + '&khmbmc=' + khmbmc,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	if(data.status === "success"){

    			sessionStorage.setItem("currentTemplateId", data.data[0].KHMBID);
		    	dispatch(setCurrentMb(data.data[0]));
		    	dispatch(hiddenJudgeTeamList());
		    	dispatch(setSubProcess(5));
		    } else {
		    	alert(data.message);
		    }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncAddJudgeTeam(khfaid, khmbid, value){
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/addJudgeTeam?khfaid=' + khfaid + '&khmbid=' + khmbid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	if(data.status === "success"){
	    		dispatch(asyncIsTemplateCompleted(khmbid));
	    		dispatch(setJudgeTeam(data.isNotExist));
	    		dispatch(showJudgeTeamList());
	    	} else {
	    		let info='';
	    		data.isExist.forEach(i=>{info=info+" "+i});
	    		alert("以下信息重复："+info);
	    	}
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncAddJudge(pwzid, value){
	return function(dispatch){//dispatch
    // API：

	    return fetch(commonUrl + '/addJudge?pwzid=' + pwzid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	if(data.status == "success"){
	    		dispatch(showJudgeTeamList());
	    	} else {
	    		alert(data.message);
	    		dispatch(hiddenJudgeTeamList());
	    	}
	    	dispatch(setSubProcess(5));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function setProgramStatus(khfaid, detail){
	return {type: SET_PROGRAM_STATUS, khfaid, detail}
}
export function asyncIsProgramCompleted(khfaid){
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/isCompletedProgram?khfaid=' + khfaid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	let res = {};
	    	if(data.status === "success"){
	    		let temp = {}
	    		data.data.forEach((item) => {
	    			temp[item.MBLXID] = item.isCompleted;
	    		});
	    		if(data.message === "ok"){
	    			res.status = true;
	    		} else {
	    			res.status = false;
	    		}
	    		res.detail = temp;
	    	} else {
	    		// alert(data.message);
	    		res.status = false;
	    		res.detail = {};
	    	}
	    	dispatch(setProgramStatus(khfaid, res));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function setTemplateTypeStatus(mblxid, detail){
	return {type: SET_TEMPLATETYPE_STATUS, mblxid, detail}
}
export function asyncIsTemplateTypeCompleted(khfaid, mblxid){
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/isCompletedTemplateType?khfaid=' + khfaid + '&mblxid=' + mblxid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	let res = {};
	    	if(data.status === "success"){
	    		let temp = {}
	    		data.data.forEach((item) => {
	    			let tempValue = {};
	    			tempValue.status = item.isCompleted;
	    			tempValue.KHMBMC = item.KHMBMC
	    			temp[item.KHMBID] = tempValue;
	    		});
	    		if(data.message === "ok"){
	    			res.status = true;
	    		} else {
	    			res.status = false;
	    		}
	    		res.detail = temp;
	    	} else {
	    		// alert(data.message);
	    		res.status = false;
	    		res.detail = {};
	    	}
	    	dispatch(setTemplateTypeStatus(mblxid, res));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function setTemplateStatus(khmbid, detail){
	return {type: SET_CONFIG_TEMPLATE_STATUS, khmbid, detail}
}

export function asyncIsTemplateCompleted(khmbid){
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/isCompletedTemplate?khmbid=' + khmbid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	let res = {};
	    	if(data.status === "success"){
	    		let temp = {}
	    		data.data.forEach((item) => {
	    			let tempValue = {};
	    			tempValue.status = item.isCompleted;
	    			tempValue.PWZMC = item.PWZMC
	    			temp[item.PWZID] = tempValue;
	    		});
	    		if(data.message === "ok"){
	    			res.status = true;
	    		} else {
	    			res.status = false;
	    		}
	    		res.detail = temp;
	    	} else {
	    		// alert(data.message);
	    		res.status = false;
	    		res.detail = {};
	    	}
	    	dispatch(setTemplateStatus(khmbid, res));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
function setAllJudgeList(data) {
	return {type: SET_ALL_JUDGELIST, data}
}
export function getAllJudges(){
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/getAllPws',{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	dispatch(setAllJudgeList(data));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
// ================================= xiaomei and xiyu add on 2019/12/16 =====================

export function asyncGetAllKhcs() {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getAllKhcs',{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data !== undefined || data !== []){
	      	dispatch(setDepList(data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncGetAllKhdx() {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getAllKhdx',{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data !== undefined || data !== []){
	      	dispatch(setUserList(data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncGetAllPrograms() {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getAllPrograms',{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.data !== undefined || data.data !== []){
	      	 dispatch(setProgramList(data.data));
	      	 
	      }	   
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}

export function asyncGetAllTemplateType(faid) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getMblxs?khfaid='+faid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.data !== undefined || data.data !== []){
	      	 dispatch(setTemplateTypeList(data.data));
	      }	   
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}

export function asyncGetTemplate(faid, mblxid) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getMbids?khfaid='+ faid + '&mblxid=' +mblxid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.data !== undefined || data.data !== []){
	      	data.data.forEach((item) => {
	      		item.key = item.KHMBID;
	      	});
	      	dispatch(setTemplate(data.data));
	      	 
	      }	   
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}

export function asyncSaveConfigCS(khcsid, value) {
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/setCsTemplate?khcsid=' + khcsid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	if(data.status=='success'){
	    		dispatch(setMatchProcess(5));
	    		// dispatch(showModal("提交成功！"));
	    	}else{
	    		dispatch(setMatchProcess(6));
	    		// let info='';
	    		// data.isExist.forEach(i=>{info=info+" "+i});
	    		// dispatch(showModal("以下信息重复："+info));
	    	}
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}

export function asyncSaveConfigDX(khdxid, value) {
	return function(dispatch){//dispatch
    // API：
	    return fetch(commonUrl + '/setDxTemplate?khdxid=' + khdxid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    	if(data.status=='success'){
	    		dispatch(setMatchProcess(5));
	    		// dispatch(showModal("提交成功！"));
	    	}else{
	    		dispatch(setMatchProcess(6));
	    		// let info='';
	    		// data.isExist.forEach(i=>{info=info+" "+i});
	    		// dispatch(showModal("以下信息重复："+info));
	    	}
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}

export function asyncConfigKHDX(value) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/addKhdx',{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status=='success'){
	      	 dispatch(showModal("提交成功！"));
	      	 //dispatch(setTemplateTypeList(data.data));
	      }else{
	      		let info='';
	    		data.isExisted.forEach(i=>{info=info+" "+i});
	    		dispatch(showModal("考核对象已配置："+info));

	      }	   
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}

export function asyncConfigCS(value) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/addKhcs',{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(value)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status=='success'){
	      	
	      	 dispatch(showModal("提交成功！"));   		      	 
	      }else{
	      		let info='';
	    		data.isExisted.forEach(i=>{info=info+" "+i});
	    		dispatch(showModal("考核对象已配置："+info));

	      }	   
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncGetObject(depid) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getScore?depid=' + depid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data !== undefined || data !== []){
	      	dispatch(setObjectList(data));
	      	dispatch(setObjectStatus(1));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncGenerateJudgeTable(faid) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/generateScoreItems?khfaid=' + faid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncCalculateDepScore(faid) {
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/calculateDepScore',{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
