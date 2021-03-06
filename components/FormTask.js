import React, { useEffect, useState } from 'react';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { View, Text, Switch, KeyboardAvoidingView } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { Icon, Button } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import actiontime from './actiontime.json';
import * as DocumentPicker from 'expo-document-picker';
import {itemForm, TICKET_TASK} from '../redux/tickets'
export const FormTask = ({ richText ,id}) => {
    const actionC = actiontime;
    const taskCategory = useSelector((store) => store.ticket.taskCategory);
    const taskTemplates = useSelector((store) => store.ticket.taskTemplate);
    const user = useSelector((store) => store.app.user)
    const group = useSelector((store) => store.app.group)
    const fullsession= useSelector((store)=>store.app.fullsession)
    const session= useSelector((store)=>store.app.session)


    //
    const  dispatch = useDispatch()
    //items
    const [templates, setTemplates] = useState([{ label: 'Buscando...', value: 0 }])
    const [category, setCategory] = useState([{ label: 'Buscando...', value: 0 }])
    const [actionTime, setActionTime] = useState([{ label: 'Buscando...', value: 0, key: 0 }])
    const [users, setUser] = useState([{ label: 'Buscando...', value: 0, key: 0 }])
    const [groups, setGroups] = useState([{ label: 'Buscando...', value: 0, key: 0 }])
    //value form
    const [formTemplate, setFormTemplate] = useState('');
    const [formCategory, setFormCategory] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [stateTask, setStateTask] = useState('');
    const [actionTask, setActionTask] = useState('');
    const [userTaskTech, setUserTaskTech] = useState('')
    const [groupTask, setGroupTask] = useState('')
    const [content,setContent]=useState('')
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    useEffect(() => {
        if (actionC) {
            let actionArray = []
            actionC.forEach((x, y) => {
                const a = { label: x.label, value: x.value, key: y }
                actionArray.push(a)
            })
            setActionTime(actionArray)
        }
        const json = async () => {
            if (taskCategory != undefined) {
                let arrayCategory = [];
                taskCategory.forEach(element => {
                    const obj = {
                        label: element.name,
                        value: element.id
                    }
                    arrayCategory.push(obj)
                });
                setCategory(arrayCategory)
            }
            if (taskTemplates != undefined) {
                let arrayTemplate = [];
                taskTemplates.forEach(e => {
                    const obj = {
                        label: e.name,
                        value: e.id
                    }
                    arrayTemplate.push(obj)
                })
                setTemplates(arrayTemplate)
            }
            if (user != undefined) {
                let userArray = [];
                user.forEach(e => {
                    const obj = {
                        label: e.name,
                        value: e.id,
                        key: e.id
                    }
                    userArray.push(obj)
                })
                setUser(userArray)

            }
            if (group != undefined) {
                let GroupArray = []
                group.forEach(e => {
                    const obj = {
                        label: e.name,
                        value: e.id,
                        key: e.id
                    }
                    GroupArray.push(obj)
                })
                setGroups(GroupArray)
            }
        }
        json()
    }, [taskTemplates, taskCategory, user, group,fullsession,session])
    const editorInitializedCallback = () => {
        richText.current?.registerToolbar(function (items) {
        });
    }
    const OpenFileSystem = () => {
        const res = DocumentPicker.getDocumentAsync()
        res.then(r => {
        })
    }

    const SendData = ()=>{
        if(content!=='' && fullsession.glpiID!==undefined){
            let raw = JSON.stringify({"input":{
                "tickets_id": id,
                "taskcategories_id": formCategory,
                "users_id": fullsession.glpiID,
                "users_id_editor": 0,
                "content": content,
                "is_private": isEnabled?1:0,
                "actiontime": actionTask,
                "begin": null,
                "end": null,
                "state": stateTask,
                "users_id_tech": userTaskTech,
                "groups_id_tech": groupTask,
                "tasktemplates_id": formTemplate,
                "sourceitems_id": 1
        }})
        dispatch(itemForm(raw,session.server,session.session_token,'Ticket/'+id+'/TicketTask',session.app_token,session.valTok,'post',TICKET_TASK))
        }
      
    }
    return (
        <View style={{ flexDirection: 'column' }}>
            <View style={{ backgroundColor: '#E0E0E0', padding: 20, flexDirection: 'row' }}>
                <Text>Nuevo elemento - Tarea de una petición</Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Icon type='font-awesome-5' color='gray' name='reply' style={{ paddingRight: 10 }}></Icon>
                    <RNPickerSelect
                        style={{
                            viewContainer: {
                                width: 200,
                                borderWidth: 1,
                                borderColor: 'black',
                                borderRadius: 5,
                                color: 'black',
                                marginBottom: 10
                            }
                        }}
                        key='Templates'
                        placeholder={{
                            label: '----------',
                            value: formTemplate,
                            color: 'blue'
                        }}
                        onValueChange={text => setFormTemplate(text)}
                        items={templates}
                        value={formTemplate}
                    />
                </View>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Icon type='font-awesome-5' color='gray' name='tag' style={{ paddingRight: 10 }}></Icon>
                    <RNPickerSelect
                        style={{
                            viewContainer: {
                                width: 200,
                                borderWidth: 1,
                                borderColor: 'black',
                                borderRadius: 5,
                                color: 'black',
                                marginBottom: 10
                            }
                        }}
                        key='category'
                        placeholder={{
                            label: '----------',
                            value: formCategory,
                            color: 'blue'
                        }}
                        onValueChange={text => setFormCategory(text)}
                        items={category}
                        value={formCategory}
                    />
                </View>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Icon type='font-awesome-5' color='gray' name='lock' style={{ paddingRight: 10 }}></Icon>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Icon name='tasks' type='font-awesome-5' color='gray' style={{ paddingRight: 10 }}></Icon>
                    <RNPickerSelect
                        style={{
                            viewContainer: {
                                width: 200,
                                borderWidth: 1,
                                borderColor: 'black',
                                borderRadius: 5,
                                color: 'black',
                                marginBottom: 10
                            }
                        }}
                        key='tasks'
                        placeholder={{
                            label: '----------',
                            value: stateTask,
                            color: 'blue'
                        }}
                        onValueChange={text => setStateTask(text)}
                        items={[
                            { label: 'Información', value: 0 },
                            { label: 'Por hacer', value: 1 },
                            { label: 'Hecho', value: 2 }
                        ]}
                        value={stateTask}
                    />
                </View>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Icon name='stopwatch' type='font-awesome-5' color='gray' style={{ paddingRight: 10 }}></Icon>
                    <RNPickerSelect
                        style={{
                            viewContainer: {
                                width: 200,
                                borderWidth: 1,
                                borderColor: 'black',
                                borderRadius: 5,
                                color: 'black',
                                marginBottom: 10
                            }
                        }}
                        key='tasks'
                        placeholder={{
                            label: '----------',
                            value: actionTask,
                            color: 'blue'
                        }}
                        onValueChange={text => setActionTask(text)}
                        items={actionTime}
                        value={actionTask}
                    />
                </View>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Icon name='user' type='font-awesome-5' color='gray' style={{ paddingRight: 10 }}></Icon>
                    <RNPickerSelect
                        style={{
                            viewContainer: {
                                width: 200,
                                borderWidth: 1,
                                borderColor: 'black',
                                borderRadius: 5,
                                color: 'black',
                                marginBottom: 10
                            }
                        }}
                        key='Users'
                        placeholder={{
                            label: '----------',
                            value: userTaskTech,
                            color: 'blue'
                        }}
                        onValueChange={text => setUserTaskTech(text)}
                        items={users}
                        value={userTaskTech}
                    />
                </View>
                <View style={{ padding: 10, flexDirection: 'row' }}>
                    <Icon name='users' type='font-awesome-5' color='gray' style={{ paddingRight: 10 }}></Icon>
                    <RNPickerSelect
                        style={{
                            viewContainer: {
                                width: 200,
                                borderWidth: 1,
                                borderColor: 'black',
                                borderRadius: 5,
                                color: 'black',
                                marginBottom: 10
                            }
                        }}
                        key='Groups'
                        placeholder={{
                            label: '----------',
                            value: groupTask,
                            color: 'blue'
                        }}
                        onValueChange={text => setGroupTask(text)}
                        items={groups}
                        value={groupTask}
                    />
                </View>
            </View>
            <KeyboardAvoidingView key='TaskEditor' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <RichToolbar
                    editor={richText}
                    actions={[
                        actions.undo,
                        actions.redo,
                        actions.setStrikethrough,
                        actions.checkboxList,
                        actions.insertOrderedList,
                        actions.blockquote,
                        actions.alignLeft,
                        actions.alignCenter,
                        actions.alignRight,
                        actions.code,
                        actions.line,
                        actions.heading1,
                        actions.heading4
                    ]}
                />
            </KeyboardAvoidingView>
            <View style={{ marginBottom: 20 }}>
                <RichEditor
                    ref={richText}
                    onChange={t =>setContent(t)}
                    style={{ height: 200, borderWidth: 1, borderRadius: 5 }}
                    editorInitializedCallback={editorInitializedCallback}
                />
            </View>
            <View style={{ flexDirection: 'column' }}>
                <Button title='Archivo(s) (20 MB máx.) ' buttonStyle={{backgroundColor:'gray'}} onPress={() => OpenFileSystem()}></Button>
                <Button title='Guardar' buttonStyle={{backgroundColor:'#FEDA90',marginTop:10}} onPress={()=>SendData()} ></Button>

            </View>
        </View>
    )
}