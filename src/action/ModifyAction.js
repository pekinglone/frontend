import 'isomorphic-fetch';
import { SET_SELECTED_RULES, SET_RULE_DATA, SET_LEVEL_DATA, SET_OBJECT_TYPE, SET_OBJECT_LIST, SET_UNBIND_MBLX, SET_MODIFY_PROCESS, SET_TEMPLATETYPE_LIST, SET_TEMPLATE_LIST, SET_TABLE_TITLE, SET_TABLE_DATA, SET_JUDGE_TEAM, SET_JUDGE } from '../constants/ModifyConstants.js';
const commonUrl = 'http://assessment.backend.pepris.com';//assessment.backend.pepris.com:80';//10.225.1.51:30889';//10.225.51.151:8080';
import {setProgramList, setSubProcess, asyncGenerateJudgeTable} from './ConfigAction.js';
export function setModifyProcess(process){
	return {
    	type: SET_MODIFY_PROCESS, process
  	}
}
export function asyncGetAllTemplateType(programId){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getMblxs?khfaid=' + programId,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	dispatch(setTemplateTypeList(data.data));
	      } else {
	      	alert(data.message);
	      	dispatch(setTemplateTypeList(data.data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function setTemplateTypeList(list){
	return {
    	type: SET_TEMPLATETYPE_LIST, list
  	}
}
export function asyncGetAllTemplate(programId, templateTypeId){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getMbids?khfaid=' + programId + '&mblxid=' + templateTypeId,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	let temp = data.data;
	      	if(data.data && data.data.length > 0){
	      		temp.forEach((item, index) => {
		      		item.key = item.KHMBID;
		      	});
	      	}
	      	dispatch(setTemplateList(temp));
	      } else {
	      	alert(data.message);
	      	dispatch(setTemplateList([]));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function setTemplateList(list){
	return {
    	type: SET_TEMPLATE_LIST, list
  	}
}
export function asyncGetItems(programId, templateTypeId, templateId){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getItems?khfaid=' + programId + '&mblxid=' + templateTypeId + '&khmbid=' + templateId,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.length > 0){
	      	dispatch(setTableTitle(data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function setTableTitle(tableTitle){
	return {
    	type: SET_TABLE_TITLE, tableTitle
  	}
}
export function asyncGetItemsName(templateTypeId, templateId){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getItemsName?mblxid=' + templateTypeId + '&khmbid=' + templateId,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	dispatch(setTableData(data.data));
	      } else {
	      	alert(data.message);
	      	dispatch(setTableData([]));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function setTableData(data){
	return {
    	type: SET_TABLE_DATA, data
  	}
}
export function asyncModifyTemplate(programId, templateTypeId, mbtype, templateId, details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/modifyTemplate?khfaid=' + programId + '&mblxid=' + templateTypeId  + '&mbtype=' + mbtype+ '&khmbid=' + templateId,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	dispatch(setTableData(data.data));
	      	alert("修改成功");
	      } else {
	      	alert(data.message);
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
function setJudgeTeam(judgeTeam){
	return {
    	type: SET_JUDGE_TEAM, judgeTeam
  	}
}
export function asyncGetJudgeTeam(programId, templateId){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getJudgeTeam?khfaid=' + programId + '&khmbid=' + templateId,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	dispatch(setJudgeTeam(data.data));
	      } else {
	      	alert(data.message);
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncModifyJudgeTeam(programId, templateId, details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/modifyJudgeTeam?khfaid=' + programId + '&khmbid=' + templateId,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	if(data.data && data.data.length > 0){
	      		data.data.forEach((item) => {
		      		item.key = item.PWZID;
		      	});
	      	}
	      	dispatch(asyncGenerateJudgeTable(programId));
	      	dispatch(setJudgeTeam(data.data));
	      	alert("修改成功");
	      } else {
	      	alert(data.message);
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
function setJudge(judge){
	return{
		type: SET_JUDGE, judge
	}
}
export function getJudgesByJudgeTeamId(programId, templateId, judgeTeamId){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getJudgesByJudgeTeamId?khfaid=' + programId + '&khmbid=' + templateId + '&pwzid=' + judgeTeamId,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	dispatch(setJudge(data.data));
	      } else {
	      	alert(data.message);
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncModifyJudges(programId, templateId, judgeTeamId, details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/modifyJudges?khfaid=' + programId + '&khmbid=' + templateId + '&pwzid=' + judgeTeamId,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	dispatch(setJudge(data.data));
	      	dispatch(asyncGenerateJudgeTable(programId));
	      	alert("修改成功");
	      } else {
	      	alert(data.message);
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncModifyProject(details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/modifyProject',{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	dispatch(setProgramList(data.data));
	      	//alert("修改成功");
	      } else {
	      	alert(data.message);
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncModifyTemplateType(khfaid, details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/modifyTemplateTypebyKHFA?khfaid=' + khfaid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	dispatch(setTemplateTypeList(data.data));
	      	alert("请修改权重，以便使权重和为1，不然会影响计算效果");
	      } else {
	      	alert(data.message);
	      	dispatch(setTemplateTypeList(data.data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
function setUnbindMblx(data){
	return{
		type: SET_UNBIND_MBLX, data
	}
}
export function asyncGetUnbindmblx(){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getUnbindmblx',{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	let temp = data.data;
	      	if(data.data && data.data.length > 0){
		      	temp.forEach((item) => {
		      		item.key = item.MBLXID;
		      	});
		      }
	      	dispatch(setUnbindMblx(temp));
	      } else {
	      	alert(data.message);
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
function setObjectList(data){
	return{
		type: SET_OBJECT_LIST, data
	}
}
function setObjectType(data){
	return{
		type: SET_OBJECT_TYPE, data
	}
}
export function asyncGetObjects(khfaid, mblxid, khmbid){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getObjects?khfaid='+khfaid+'&mblxid='+mblxid+'&khmbid='+khmbid,{
	        method: 'get',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        }
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status === 'success'){
	      	let temp = data.data.KHOBJECT;
	      	dispatch(setObjectType(data.data.KHOBJECTTYPE));
	      	if(data.data && data.data.length > 0){
		      	if(data.KHOBJECTTYPE === "1"){
			      	temp.forEach((item) => {
			      		item.key = item.KHDXID;
			      	});
		      	} else {
		      		temp.forEach((item) => {
			      		item.key = item.KHCSID;
			      	});
		      	}
		    }
	      	dispatch(setObjectList(temp));
	      } else {
	      	alert(data.message);
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncModifyObjects(khfaid, mblxid, khmbid, details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/modifyObjects?khfaid='+khfaid+'&mblxid='+mblxid+'&khmbid='+khmbid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status !== 'success'){
	      	alert(data.message);
      	} 
      	let temp = data.data.KHOBJECT;
      	dispatch(setObjectType(data.data.KHOBJECTTYPE));
      	if(data.data && data.data.length > 0){
      		if(data.KHOBJECTTYPE === "1"){
		      	temp.forEach((item) => {
		      		item.key = item.KHDXID;
		      	});
	      	} else {
	      		temp.forEach((item) => {
		      		item.key = item.KHCSID;
		      	});
	      	}
      	}
      	
      	dispatch(setObjectList(temp));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncModifyTemplatexx(khfaid, mblxid, details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/modifyTemplatexx?khfaid='+khfaid+'&mblxid='+mblxid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status !== 'success'){
	      	alert(data.message);
      	  }
      	  if(data.data && data.data.length > 0){
	      	let temp = data.data;
	      	temp.forEach((item) => {
	      		item.key = item.KHMBID;
	      	});
	      }
      	dispatch(setTemplateList(temp));
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
function setLevelData(data){
	return{
		type: SET_LEVEL_DATA, data
	}
}
export function asyncGetGradeStandard(){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getGradeStandard',{
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
      	    dispatch(setLevelData(data.data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncModifyGradeStandard(details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/modifyGradeStandard',{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status !== 'success'){
	      	alert(data.message);
      	  }
      	  if(data.data && data.data.length > 0){
	      	let temp = data.data;
	      	temp.forEach((item) => {
	      		item.key = item.DCBZID;
	      	});
      	    dispatch(setLevelData(temp));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncAddGradeStandard(details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/addGradeStandard',{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status !== 'success'){
	      	alert(data.message);
      	  }
      	  if(data.data && data.data.length > 0){
	      	let temp = data.data;
	      	temp.forEach((item) => {
	      		item.key = item.DCBZID;
	      	});
      	    dispatch(setLevelData(temp));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
function setRuleData(data){
	return{
		type: SET_RULE_DATA, data
	}
}
export function asyncGetGradeRatio(){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getGradeRatio',{
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
	      		item.key = item.JFXZID;
	      	});
      	    dispatch(setRuleData(data.data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncModifyGradeRatio(details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/modifyGradeRatio',{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status !== 'success'){
	      	alert(data.message);
      	  }
      	  if(data.data && data.data.length > 0){
	      	let temp = data.data;
	      	temp.forEach((item) => {
	      		item.key = item.JFXZID;
	      	});
      	    dispatch(setRuleData(temp));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncAddGradeRatio(details){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/addGradeRatio',{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
	      if(data.status !== 'success'){
	      	alert(data.message);
      	  }
      	  if(data.data && data.data.length > 0){
	      	data.data.forEach((item) => {
	      		item.key = item.JFXZID;
	      	});
      	    dispatch(setRuleData(data.data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
function setSelectedRules(data){
	return {type: SET_SELECTED_RULES, data};
}
export function asyncGetGradeRatiobyJudg(pwzid, strategy){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/getGradeRatiobyJudge?pwzid=' + pwzid,{
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
	      		item.key = item.JFXZID;
	      		Object.keys(strategy).forEach((iitem) => {
					if(iitem === item.STRATEGY){
						item.rule = strategy[iitem];
					}
	      		});
	      	});
      	    dispatch(setSelectedRules(data.data));
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}
export function asyncBindJudgeTeamGrade(pwzid, details, strategy, source){
	return function(dispatch){//dispatch
    // API
	    return fetch(commonUrl + '/bindJudgeTeamGrade?pwzid=' + pwzid,{
	        method: 'post',
	        headers: {
	          'Access-Control-Allow-Origin': '*'
	        },
	        body:JSON.stringify(details)
	    }).then(function(res){
	      return res.json(); //error here
	    }).then(function(data){
      	  if(data.data && data.data.length > 0){
	      	data.data.forEach((item) => {
	      		item.key = item.JFXZID;
	      		Object.keys(strategy).forEach((iitem) => {
					if(iitem === item.STRATEGY){
						item.rule = strategy[iitem];
					}
	      		});
	      	});
      	    dispatch(setSelectedRules(data.data));
      	    if(data.status === "success" && source === 1){
				dispatch(setSubProcess(7));
      	    }
	      }
	    }).catch((error) => {
	      console.log(error);
	    });
  	};
}