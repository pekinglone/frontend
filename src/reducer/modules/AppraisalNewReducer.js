import { SET_USER_INFO, SET_CURRENT_TEMPLATETYPEID, SET_CURRENT_PROGRAMID, SET_PROGRAM_AND_TEMPLATETYPE, SET_SELECTED_KEYS } from '../../constants/AppraisalNewConstants.js';
import { SET_TEMPLATE_AND_OBJECT, SET_CURRENT_TEMPLATEID, SET_CURRENT_OBJECTTYPE, SET_MB_TYPE, SET_CURRENT_OBJECTID } from '../../constants/AppraisalNewConstants.js';
import { SET_CURRENT_STATUS, HIDDEN_MODAL, SHOW_MODAL, SET_GROUP_TITLE, SET_PERSON_TITLE, SET_KPI_TITLE, SET_DATA_SOURCE, SET_UNCOMPLETED_TEMPLATE } from '../../constants/AppraisalNewConstants.js';
const initialState = {
  programAndTemplateType: [],
  currentProgramId: '',
  currentTemplateTypeId: '',
  currentuser: '',
  templateAndObject: [],
  currentTemplateId: '',
  currentMbType: '',
  currentObjectId: '',
  groupTitleList:[],
  personTitleList:[],
  kpiTitleList: [],
  dataSource: [],
  uncompletedTemplate: [],
  modal:{
    visible: false,
    content: ''
  },
  selectedKeys: ["0"],
  currentLevelStatus: []
};

export default function reducer(state = initialState, action){
  switch (action.type){
    case SET_CURRENT_STATUS:
      return Object.assign(
        {},
        state,
        {currentLevelStatus: action.data}
      );
    case SET_PROGRAM_AND_TEMPLATETYPE:
      return Object.assign(
        {},
        state,
        {programAndTemplateType: action.data}
      );
    case SET_CURRENT_PROGRAMID:
      return Object.assign(
        {},
        state,
        {currentProgramId: action.programId}
      );
    case SET_CURRENT_TEMPLATETYPEID:
      return Object.assign(
        {},
        state,
        {currentTemplateTypeId: action.templateTypeId}
      );
    case SET_USER_INFO:
      return Object.assign(
        {},
        state,
        {currentuser: action.userId}
      );
    case SET_TEMPLATE_AND_OBJECT:
      return Object.assign(
        {},
        state,
        {templateAndObject: action.data}
      );
    case SET_CURRENT_TEMPLATEID:
      return Object.assign(
        {},
        state,
        {currentTemplateId: action.templateId}
      );
    case SET_CURRENT_OBJECTTYPE:
      return Object.assign(
        {},
        state,
        {currentObjectType: action.objectType}
      );
    case SET_MB_TYPE:
      return Object.assign(
        {},
        state,
        {currentMbType: action.mbtype}
      );
    case SET_CURRENT_OBJECTID:
      return Object.assign(
        {},
        state,
        {currentObjectId: action.currentObjectId}
      );
    case SET_GROUP_TITLE:
      return Object.assign(
        {},
        state,
        {groupTitleList: action.groupTitle}
      );
    case SET_PERSON_TITLE:
      return Object.assign(
        {},
        state,
        {personTitleList: action.personTitle}
      );
    case SET_KPI_TITLE:
      return Object.assign(
        {},
        state,
        {kpiTitleList: action.data}
      );
    case SET_DATA_SOURCE:
      return Object.assign(
        {},
        state,
        {dataSource: action.data}
      );
    case SET_UNCOMPLETED_TEMPLATE:
      return Object.assign(
        {},
        state,
        {uncompletedTemplate: action.data}
      );
    case SHOW_MODAL:
      return Object.assign(
        {},
        state,
        {modal: {visible: true, content: action.content}}
      );
    case HIDDEN_MODAL:
      return Object.assign(
        {},
        state,
        {modal: {visible: false}}
      );
    case SET_SELECTED_KEYS:
      return Object.assign(
        {},
        state,
        {selectedKeys: action.keys}
      );
    default:
      return state;
  }
}