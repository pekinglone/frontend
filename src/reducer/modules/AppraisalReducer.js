import { SET_TEMPLATE_TYPE, SET_KPI_TITLE, SET_KPI_DETAIL, SET_JUDGED_PEOPLE, SET_USER_INFO, SET_MENU_STATUS, HIDDEN_MODAL, SHOW_MODAL, SET_TEMPLATE, SET_MENU, SET_APPRAISAL_TEMPLATETYPE_STATUS, SET_GROUP_TITLE, SET_DATA_SOURCE, SET_PERSON_TITLE, SET_UNCOMPLETED_TEMPLATE, SET_CURRENT_GROUP } from '../../constants/AppraisalConstants.js';
const initialState = {
  menuStatus: {
    // 1: true,
    // 2: false,
    // 3: false
  },
  menuList:[],
  templateStatus: {},
  templateList:[],
  group: {
    '信息与科技管理处': "3",
    '油田开发处': "13"
  },
  personTitleList:[],
  groupTitleList:[],
  uncompletedTemplate: [],
  dataSource:[],
  modal:{
    visible: false,
    content: ''
  },
  curGroup:'',
  currentuser: '',
  peoplegroup: [],
  kpidetail:[],
  kpiTitleList:[],
  currentTemplateType:''
};

export default function reducer(state = initialState, action){
  switch (action.type){
  case SET_TEMPLATE_TYPE:
    return Object.assign(
      {},
      state,
      {currentTemplateType: action.mblx}
    );
  case SET_KPI_TITLE:
    return Object.assign(
      {},
      state,
      {kpiTitleList: action.data}
    );
  case SET_KPI_DETAIL:
    return Object.assign(
      {},
      state,
      {kpidetail: action.data}
    );
  case SET_JUDGED_PEOPLE:
    return Object.assign(
      {},
      state,
      {peoplegroup: action.data}
    );
  case SET_USER_INFO:
    return Object.assign(
      {},
      state,
      {currentuser: action.userId}
    );
  case SET_MENU_STATUS:
    return Object.assign(
      {},
      state,
      {menuStatus: action.value}
    );
  case HIDDEN_MODAL:
    return Object.assign(
      {},
      state,
      {modal: {visible: false}}
    );
  case SHOW_MODAL:
    return Object.assign(
      {},
      state,
      {modal: {visible: true, content: action.content}}
    );
  case SET_TEMPLATE:
    return Object.assign(
      {},
      state,
      {templateList: action.template}
    );
  case SET_MENU:
    return Object.assign(
      {},
      state,
      {menuList: action.detail}
    );
  case SET_APPRAISAL_TEMPLATETYPE_STATUS:
    return Object.assign(
      {},
      state,
      {templateStatus: action.status}
    );
  case SET_GROUP_TITLE:
    return Object.assign(
      {},
      state,
      {groupTitleList: action.groupTitle}
    );
  case SET_DATA_SOURCE:
    return Object.assign(
      {},
      state,
      {dataSource: action.data}
    );
  case SET_PERSON_TITLE:
    return Object.assign(
      {},
      state,
      {personTitleList: action.personTitle}
    );
  case SET_UNCOMPLETED_TEMPLATE:
    return Object.assign(
      {},
      state,
      {uncompletedTemplate: action.data}
    );
  case SET_CURRENT_GROUP:
    return Object.assign(
      {},
      state,
      {curGroup: action.group}
    );

  // case INPUT_CHANGED:
  //   return Object.assign(
  //     {},
  //     state,
  //     {newToDo: action.value}
  //   );
  // case LIST_ITEM_CLICK:
  //   return Object.assign(
  //     {},
  //     state,
  //     {
  //       list: [
  //         ...state.list.slice(0, action.index),
  //         Object.assign({}, state.list[action.index], {done: !state.list[action.index].done}),
  //         ...state.list.slice(action.index+1)
  //       ]
  //     }
  //   );
  // case DELETE_LIST_ITEM:
  //   return Object.assign(
  //     {},
  //     state,
  //     {
  //       list: [
  //         ...state.list.slice(0, action.index),
  //         ...state.list.slice(action.index+1)
  //       ]
  //     }
  //   );
  default:
    return state;
  }
}