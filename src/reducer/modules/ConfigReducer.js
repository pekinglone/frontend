// import update from 'react/lib/update';
import { SET_ALL_JUDGELIST, RESET_JUDGETESM_LIST, SET_CONFIG_TEMPLATE_STATUS, SET_TEMPLATETYPE_STATUS, SET_PROGRAM_STATUS, SHOW_JUDGE_LIST, HIDDEN_JUDGE_LIST, SET_JUDGE_LIST, SET_CURRENT_PWZID, SET_JUDGE_TEAM, SHOW_JUDGE_TEAMLIST, HIDDEN_JUDGE_TEAMLIST, SHOW_ADD_TEMPLATE, HIDDEN_ADD_TEMPLATE, SHOW_EDIT_TEMPLATE, HIDDEN_EDIT_TEMPLATE, SHOW_CREATE_TEMPLATE, HIDDEN_CREATE_TEMPLATE, SET_CURRENT_TEMPLATE, SET_TEMPLATE_LIST, SET_CURRENT_FAID, SET_PROGRAM_LIST, SET_FAXX_STATUS, SET_CURRENT_MBLXID, SET_CURRENT_MBLXMC, SET_CURRENT_MBLX, SET_DEP_LIST, SET_USER_LIST, SET_MAIN_PROCESS, SET_SUB_PROCESS, SET_EDITABLE_TABLEHEADER, INIT_TEMPLATE_TYPE } from '../../constants/AppraisalConstants.js';
import { SET_MATCH_PROCESS, SET_PROGRAME_LIST, SET_DEP_BIND_PROGRAM, SET_OBJECT_BIND_PROGRAM, SET_BIND_PROGRAM, SET_TMPTYPE_LIST, BIND_TMPTYPE, BIND_TEMPLATE_TYPE, SET_TEMPLATE_COFIG, SET_RESULT, SET_SUB_MATCH, SET_NULL, SET_OBJECT_STATUS, SET_OBJECT_LIST, SET_ALLUSER_LIST, SET_ALLDEP_LIST } from '../../constants/AppraisalConstants.js';
const initialState = {
	mainProcess: 0,
	subProcess: 0,
  alluserList:[],
  alldepList:[],
	userList:[],
	depList:[],
	allUserTitle:[{title: ' ', dataIndex: 'op', key: 'op'},
				  {title: '姓名', dataIndex: 'USERNAME', key: 'USERNAME'},
  				  {title: 'ID', dataIndex: 'USERID', key: 'USERID'},
  				  {title: '职称', dataIndex: 'POSMC', key: 'POSMC'},
  				  {title: '部门', dataIndex: 'DEPNAME', key: 'DEPNAME'}],
	editableTableHeader:[],
	templateType: 0,
	currentFaid: 0,
	currentMblxmc: 0,
	currentMblxId: 0,
  currentMblx: 0,
  currentPwzId: 0,
  currentMB:{},// {"KHMBID":"9","KHMBMC":"信息所-重点工作测试考核"}
	mblx1Title: [{title: '指标项目', dataIndex: 'KHZBMC', key: 'KHZBMC', editable: true},
				 {title: '考核目标值', dataIndex: 'KHZBPJBZ', key: 'KHZBPJBZ', editable: true},
				 {title: '考核权重', dataIndex: 'KHZBQZ', key: 'KHZBQZ', editable: true},
				 {title: '指标完成情况', dataIndex: 'KHZBWCQK', key: 'KHZBWCQK', editable: true}],
	mblx3Title: [{title: '指标类别', dataIndex: 'KHZBLXMC', key: 'KHZBLXMC', editable: true},
				 {title: '指标项目', dataIndex: 'KHZBMC', key: 'KHZBMC', editable: true},
				 {title: '考核目标值', dataIndex: 'KHZBPJBZ', key: 'KHZBPJBZ', editable: true},
				 {title: '考核权重', dataIndex: 'KHZBQZ', key: 'KHZBQZ', editable: true},
				 {title: '指标完成情况', dataIndex: 'KHZBWCQK', key: 'KHZBWCQK', editable: true}],
	curFastatus:'',
  newProgramList: [],
  newTemplateList: [],
  showAddTemplate: false,// 控制模板页中增加一个模板的按钮显示，true时显示，false时隐藏
  showEditTable: false,// 控制模板页中编辑指标项的表格及其按钮的显示，true时显示，false时隐藏
  createTemplate: true,// 控制模板页中编辑模板名及提交按钮的显示，true时显示，false时隐藏
  showJudgeTeamList: false, // 控制评委页中已经创建的评委列表显示，即在添加评委组之后，显示创建成功的评委组
  showJudgeList: false, // 控制添加评委页中显示选择评委的表格，还是显示已经选择好的评委，让人们对其进行评分
  judgeTeamList: [],// {"PWZMC":"考核组20","PWZQZ":"0.4","PWZID":"27"}
  judgeList: [],// {"PWID":"1","PWQZ":"0.4","PWMC":fanzh}
  programStatus: {},
  templateTypeStatus: {},
  templateStatus: {},
  allJudgeList:[],
  // ======================xiaomei and xiyu add on 20191216 ===================
  programList:[],
  templatelist:[],
  objectbindprogram:[],
  depbindprogram:[],
  programbind:[],
  templatebind:[],
  allProgramTitle:[{title: '序号', dataIndex: 'KHFAID', key: 'KHFAID'},
                    {title: '方案名称', dataIndex: 'KHFAMC', key: 'KHFAMC'}],
  templatelistTitle:[{title: '模板ID', dataIndex: 'KHMBID', key: 'KHMBID'},
                {title: '模板名称', dataIndex: 'KHMBMC', key: 'KHMBMC'}],
  allObjectTitle:[{title: '姓名', dataIndex: 'USERNAME', key: 'USERNAME'},
            {title: 'ID', dataIndex: 'USERID', key: 'USERID'},
            {title: '职称', dataIndex: 'POSMC', key: 'POSMC'},
            {title: '部门', dataIndex: 'DEPNAME', key: 'DEPNAME'}],
  allDepTitle:[{title: '部门ID', dataIndex: 'DEPID', key: 'DEPID'},
            {title: '部门名称', dataIndex: 'DEPNAME', key: 'DEPNAME'}],
  allUserTitle:[{title: ' ', dataIndex: 'op', key: 'op'},
          {title: '姓名', dataIndex: 'USERNAME', key: 'USERNAME'},
            {title: 'ID', dataIndex: 'USERID', key: 'USERID'},
            {title: '职称', dataIndex: 'POSMC', key: 'POSMC'},
            {title: '部门', dataIndex: 'DEPNAME', key: 'DEPNAME'}],
  allCSTitle:[{title: ' ', dataIndex: 'op', key: 'op'},
              {title: '部门ID', dataIndex: 'DEPID', key: 'DEPID'},
              {title: '部门名称', dataIndex: 'DEPNAME', key: 'DEPNAME'}],
  matchProcess: 10,
  submatchProcess: 0,

  tmpTypeList:[],
  bindTemplateList:[],
  tmpTypeTitle:[{title: '权重', dataIndex: 'MBLXQZ', key: 'MBLXQZ'},
                {title: '模板类型ID', dataIndex: 'MBLXID', key: 'MBLXID'},
                {title: '模板类型名称', dataIndex: 'MBLXMC', key: 'MBLXMC'},
                {title: ' ', dataIndex: 'op', key: 'op'}],
  finalbind : {},
  resultTitle:[{title: '考核对象', dataIndex: 'KHDXMC', key: 'KHDXMC'},
              {title: '方案名称', dataIndex: 'KHFAMC', key: 'KHFAMC'},
              {title: '模板类型名称', dataIndex: 'KHMBLXMC', key: 'KHMBLXMC'},
              {title: '模板名称', dataIndex: 'KHMBMC', key: 'KHMBMC'}],
  objectStatus:0,
  objectList:[],
  scoreTitle:[{title: '姓名', dataIndex: 'KHDXMC',key: 'KHDXMC'},
              {title: 'ID', dataIndex: 'KHDXID',key: 'KHDXID'},
              {title: '处室', dataIndex: 'DEPNAME',key: 'DEPNAME'},
              {title: '分数', dataIndex: 'DF',key: 'DF'}]
};
export default function reducer(state = initialState, action){
  switch (action.type){
  case SET_ALL_JUDGELIST:
    return Object.assign(
      {},
      state,
      {allJudgeList: action.data}
    );
  case RESET_JUDGETESM_LIST:
    return Object.assign(
      {},
      state,
      {judgeTeamList: []}
    );
  case SET_CONFIG_TEMPLATE_STATUS:
    let templateTemp = state;
    templateTemp.templateStatus[action.khmbid] = action.detail;
    return Object.assign({}, templateTemp);
  case SET_TEMPLATETYPE_STATUS:
    let temp = state;
    temp.templateTypeStatus[action.mblxid] = action.detail;
    return Object.assign({}, temp);
  case SET_PROGRAM_STATUS:
    let tempState = state;
    tempState.programStatus[action.khfaid] = action.detail;
    return Object.assign({}, tempState);
  case SHOW_JUDGE_LIST:
    return Object.assign(
      {},
      state,
      {showJudgeList: true}
    );
  case HIDDEN_JUDGE_LIST:
    return Object.assign(
      {},
      state,
      {showJudgeList: false}
    );
  case SET_JUDGE_LIST:
    return Object.assign(
      {},
      state,
      {judgeList: action.judgeList}
    );
  case SET_CURRENT_PWZID:
    return Object.assign(
      {},
      state,
      {currentPwzId: action.pwzid}
    );
  case SET_JUDGE_TEAM:
    return Object.assign(
      {},
      state,
      {judgeTeamList: action.judgeList}
    );
  case SHOW_JUDGE_TEAMLIST:
    return Object.assign(
      {},
      state,
      {showJudgeTeamList: true}
    );
  case HIDDEN_JUDGE_TEAMLIST:
    return Object.assign(
      {},
      state,
      {showJudgeTeamList: false}
    );
  case SHOW_ADD_TEMPLATE:
    return Object.assign(
      {},
      state,
      {showAddTemplate: true}
    );
  case HIDDEN_ADD_TEMPLATE:
    return Object.assign(
      {},
      state,
      {showAddTemplate: false}
    );
  case SHOW_EDIT_TEMPLATE:
    return Object.assign(
      {},
      state,
      {showEditTable: true}
    );
  case HIDDEN_EDIT_TEMPLATE:
    return Object.assign(
      {},
      state,
      {showEditTable: false}
    );
  case SHOW_CREATE_TEMPLATE:
    return Object.assign(
      {},
      state,
      {createTemplate: true}
    );
  case HIDDEN_CREATE_TEMPLATE:
    return Object.assign(
      {},
      state,
      {createTemplate: false}
    );
  case SET_CURRENT_TEMPLATE:
    return Object.assign(
      {},
      state,
      {currentMB: action.currentMb}
    );
  case SET_TEMPLATE_LIST:
    return Object.assign(
      {},
      state,
      {newTemplateList: action.value}
    );
  case SET_CURRENT_FAID:
    return Object.assign(
      {},
      state,
      {currentFaid: action.faid}
    );
  case SET_PROGRAM_LIST:
    return Object.assign(
      {},
      state,
      {newProgramList: action.faList}
    );
  case SET_FAXX_STATUS:
    return Object.assign(
      {},
      state,
      {curFastatus: action.faxxstatus}
    );
  case SET_CURRENT_MBLXMC:
  	return Object.assign(
      {},
      state,
      {currentMblxmc: action.mblx}
    );
  case SET_CURRENT_MBLXID:
  	return Object.assign(
      {},
      state,
      {currentMblxId: action.mblxid}
    );
  case SET_CURRENT_MBLX:
    return Object.assign(
      {},
      state,
      {currentMblx: action.mblx}
    );
  case SET_MAIN_PROCESS:
  	return Object.assign(
      {},
      state,
      {mainProcess: action.process}
    );
  case SET_SUB_PROCESS:
  	return Object.assign(
      {},
      state,
      {subProcess: action.process}
    );
  case SET_USER_LIST:
  	return Object.assign(
      {},
      state,
      {userList: action.userList}
    );
  case SET_DEP_LIST:
  	return Object.assign(
      {},
      state,
      {depList: action.depList}
    );
   case SET_EDITABLE_TABLEHEADER:
  	return Object.assign(
      {},
      state,
      {editableTableHeader: action.tableHeader}
    );
   case INIT_TEMPLATE_TYPE:
    return Object.assign(
      {},
      state,
      {templateType: action.mblx}
    );
    // =========================== xiaomei and xiyu add on 20191216 ===============================
    case SET_MATCH_PROCESS:
    return Object.assign(
      {},
      state,
      {matchProcess: action.process}
    );
    case SET_PROGRAME_LIST:
    return Object.assign(
      {},
      state,
      {programList: action.programList}
    );
    case SET_DEP_BIND_PROGRAM:
    return Object.assign(
      {},
      state,
      {depbindprogram: action.dep}
    );
    case SET_OBJECT_BIND_PROGRAM:
    return Object.assign(
      {},
      state,
      {objectbindprogram: action.object}
    );
    case SET_BIND_PROGRAM:
    return Object.assign(
      {},
      state,
      {programbind: action.program}
      );
    case SET_TMPTYPE_LIST:
    return Object.assign(
      {},
      state,
      {tmpTypeList: action.tmpTypeList}
    );
    case BIND_TMPTYPE:
    return Object.assign(
      {},
      state,
      {templatebind:action.template}
      );
    case BIND_TEMPLATE_TYPE:
    return Object.assign(
      {},
      state,
      {bindTemplateList:action.templatetype}
      );
    case SET_TEMPLATE_COFIG:
    return Object.assign(
      {},
      state,
      {templatelist:action.template}
      );
    case SET_RESULT:
    let finalTemp = state;
    finalTemp.finalbind[action.khmbid] = action.detail;
    return Object.assign(
      {},
      finalTemp
      );
    case SET_SUB_MATCH:
    return Object.assign(
      {},
      state,
      {submatchProcess: action.process}
      );
    case SET_NULL:
    return Object.assign(
      {},
      state,
      {finalbind: action.result}
      );
    case SET_OBJECT_STATUS:
    return Object.assign(
      {},
      state,
      {objectStatus: action.status}
    );
    case SET_OBJECT_LIST:
    return Object.assign(
      {},
      state,
      {objectList: action.objectList}
    );
    case SET_ALLUSER_LIST:
    return Object.assign(
      {},
      state,
      {alluserList: action.userList}
    );
  case SET_ALLDEP_LIST:
    return Object.assign(
      {},
      state,
      {alldepList: action.depList}
    );
  case SET_USER_LIST:
    return Object.assign(
      {},
      state,
      {userList: action.userList}
    );
  case SET_DEP_LIST:
    return Object.assign(
      {},
      state,
      {depList: action.depList}
    );
  default:
    return state;
  }
}