// import update from 'react/lib/update';
import {SET_SELECTED_RULES, SET_RULE_DATA, SET_LEVEL_DATA, SET_OBJECT_TYPE, SET_OBJECT_LIST, SET_UNBIND_MBLX, SET_MODIFY_PROCESS, SET_TEMPLATETYPE_LIST, SET_TEMPLATE_LIST, SET_TABLE_TITLE, SET_TABLE_DATA, SET_JUDGE_TEAM, SET_JUDGE} from '../../constants/ModifyConstants.js';
const initialState = {
  allProgramTitle:[{title: 'ID', dataIndex: 'KHFAID', key: 'KHFAID'},
                  {title: '方案名称', dataIndex: 'KHFAMC', key: 'KHFAMC', editable: true}],
                  //{title: '操作', dataIndex: 'op', key: 'op'}],
  modifyProcess: 0,
  templateTypeList: [],
  allTemplateTypeTitle:[{title: 'ID', dataIndex: 'MBLXID', key: 'MBLXID'},
                  {title: '模板类型名称', dataIndex: 'MBLXMC', key: 'MBLXMC', editable: true},
                  {title: '模板类型权重', dataIndex: 'MBLXQZ', key: 'MBLXQZ', editable: true}],
                  // {title: '操作', dataIndex: 'op', key: 'op'}],
  templateList: [],
  allTemplateTitle:[{title: 'ID', dataIndex: 'KHMBID', key: 'KHMBID'},
                  {title: '模板名称', dataIndex: 'KHMBMC', key: 'KHMBMC', editable: true},
                  {title: '操作', dataIndex: 'op', key: 'op'}],
  tableTitle:[],
  tableData: [],
  judgeTeam: [],
  judge: [],
  unbindMblxList: [],
  objectList: [],
  objectType: "0",
  levelTitle:[{title: '档次ID', dataIndex: 'DCBZID', key: 'DCBZID'},
    		  {title: '档次名称', dataIndex: 'DCBZMC', key: 'DCBZMC', editable: true},        
              {title: '最大分值', dataIndex: 'MAXGRADE', key: 'MAXGRADE', editable: true},
              {title: '最小分值', dataIndex: 'MINGRADE', key: 'MINGRADE', editable: true},
              {title: '操作', dataIndex: 'op', key: 'op'}],
  levelData: [],
  ruleTitle:[{title: '策略ID', dataIndex: 'JFXZID', key: 'JFXZID'},
    		  {title: '档次名称', dataIndex: 'DCBZID', key: 'DCBZID'},        
              {title: '策略', dataIndex: 'STRATEGY', key: 'STRATEGY'},
              {title: '条件', dataIndex: 'PERCENTAGE', key: 'PERCENTAGE', editable: true},
              {title: '操作', dataIndex: 'op', key: 'op'}],
  ruleData: [],
  strategy: {"2": "大于等于", "1": "小于等于"},
  gradeType: {"1": "95, 90, 85, 80, 75", "0": "5, 4, 3, 2, 1"},
  selectedRules: []
};
//"JFXZID":"1","DCBZMC":"A","STRATEGY":"1","JFZID":"1","DCBZID":"1","PERCENTAGE":0.2
export default function reducer(state = initialState, action){
  switch (action.type){
  	case SET_SELECTED_RULES:
  		return Object.assign(
	      {},
	      state,
	      {selectedRules: action.data}
	    );
  	case SET_RULE_DATA:
  		return Object.assign(
	      {},
	      state,
	      {ruleData: action.data}
	    );
  	case SET_LEVEL_DATA:
  		return Object.assign(
	      {},
	      state,
	      {levelData: action.data}
	    );
  	case SET_OBJECT_TYPE:
  		return Object.assign(
	      {},
	      state,
	      {objectType: action.data}
	    );
  	case SET_OBJECT_LIST:
  		return Object.assign(
	      {},
	      state,
	      {objectList: action.data}
	    );
  	case SET_UNBIND_MBLX:
  		return Object.assign(
	      {},
	      state,
	      {unbindMblxList: action.data}
	    );
    case SET_MODIFY_PROCESS:
	    return Object.assign(
	      {},
	      state,
	      {modifyProcess: action.process}
	    );
    case SET_TEMPLATETYPE_LIST:
	    return Object.assign(
	      {},
	      state,
	      {templateTypeList: action.list}
	    );
    case SET_TEMPLATE_LIST:
	    return Object.assign(
	      {},
	      state,
	      {templateList: action.list}
	    );
	case SET_TABLE_TITLE:
	    return Object.assign(
	      {},
	      state,
	      {tableTitle: action.tableTitle}
	    );
	case SET_TABLE_DATA:
	    return Object.assign(
	      {},
	      state,
	      {tableData: action.data}
	    );
	case SET_JUDGE_TEAM:
		return Object.assign(
	      {},
	      state,
	      {judgeTeam: action.judgeTeam}
	    );
	case SET_JUDGE:
		return Object.assign(
	      {},
	      state,
	      {judge: action.judge}
	    );
    default:
      return state;
  }
}