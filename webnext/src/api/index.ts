import clientConnectionWithSupabase from '@/lib/supabase/client'
import { Anybody } from 'next/font/google';
import { NextResponse } from 'next/server';

const URL = 'http://127.0.0.1:8000'
// const URL = 'https://vidchatbackend.vercel.app'
export const getVideosBasedOnQuery = async (query: string) => {
    try {
        const response = await fetch(`${URL}/ytchat/explore?q=${query}`)
        const data = await response.json()
        const dat = JSON.parse(data)
        return { success: true, data: dat.videos }
    } catch (error) {
        console.error('Error:', error)
        return { success: false, error: "Issue in server !" }
    }
}

export const getVideosBasedOnURL = async (query: string) => {
    try {
        const response = await fetch(`${URL}/ytchat/search?q=${query}`)
        const data = await response.json()
        const dat = JSON.parse(data)
        return { success: true, data: dat.videos }
    } catch (error) {
        console.error('Error:', error)
        return { success: false, error: "Issue in server !" }
    }
}

export const getVideoDataFromSupabase = async (id: string) => {
    const supabase = clientConnectionWithSupabase()
    let { data, error }: any = await supabase
        .from('vidChat-Chats')
        .select("*")
        .eq('video_id', id)
    console.log(error)
    if (error !== null) return { success: false, error: error.message }
    else return { success: true, data: data }
}

export const UpdateTheVideoChatContent = async (videoData: any) => {
    const supabase = clientConnectionWithSupabase()
    let { data: doesRowExits, error }: any = await supabase
        .from('vidChat-Chats')
        .select("*")
        .eq('video_id', videoData.video_id)
    if (error !== null) {
        console.log(error)
        return { success: false, error: error.message }
    } else if (doesRowExits.length === 0) {
        const { data: insertData, error: insertError }: any = await supabase
            .from('vidChat-Chats')
            .insert([
                { video_id: videoData.video_id, chat: videoData.chat, duration: videoData.duration, title: videoData.title, user_id: videoData.user_id, url_suffix: videoData.url_suffix, thumbnails: videoData.thumbnails, views: videoData.views, channel: videoData.channel, extractedText: videoData.extractedText },
            ])
            .select()
        console.log(insertError)
        if (insertError !== null) return { success: false, error: insertError.message }
        return
    } else {
        const { data: updateData, error: updateError }: any = await supabase
            .from('vidChat-Chats')
            .update({ chat: videoData.chat })
            .eq('video_id', videoData.video_id)
            .select()
        console.log(updateError)
        if (error !== null) return { success: false, error: updateError.message }
        return
    }
}

export const GetVideoIntoText = async (videoID: string) => {
    try {
        const response = await fetch(`${URL}/ytchat/start-chat?videoid=${videoID}`)
        const data = await response.json()
        if (response.status === 500) {
            return { success: false, error: "Some Issue With Server" }
        }
        return { success: true, text: data.text }
    } catch (error) {
        console.error('Error:', error)
        return { success: false, error: "Issue in server !" }
    }
}


export const getSharedChatData = async (id: string) => {
    const supabase = clientConnectionWithSupabase()
    let { data: chat_share, error }: any = await supabase
        .from('chat_share')
        .select("*")
        .eq('video_id', id)
    if (error !== null) return { success: false, error: error.message }
    return { success: true, data: chat_share }
}

export const publishShareData = async (chatData: any) => {
    const supabase = clientConnectionWithSupabase()
    let { data: chat_share, error }: any = await supabase
        .from('chat_share')
        .select("*")
        .eq('video_id', chatData.video_id)
    console.log(error)
    if (error !== null) return { success: false }
    if (chat_share.length === 0) {
        const { data, error: IError }: any = await supabase
            .from('chat_share')
            .insert([
                { ...chatData },
            ])
            .select()
        console.log(Error)
        if (IError !== null) return { success: false }
        return { success: true }
    } else {
        const { data, error: AError }: any = await supabase
            .from('chat_share')
            .update({ chat: chatData.chat })
            .eq('video_id', chatData.video_id)
            .select()
        console.log(AError)
        if (AError !== null) return { success: false }
        return { success: true }
    }
}



export const getAllchats = async (user_id: string) => {
    const supabase = clientConnectionWithSupabase()
    let { data: vidChat, error } = await supabase
        .from('vidChat-Chats')
        .select("*")
        .eq('user_id', user_id)
    console.log(error)
    if (error !== null) return { success: false }
    return { success: true, data: vidChat }
}

export const getAllDocuments = async (user_id: string) => {
    const supabase = clientConnectionWithSupabase()
    let { data: DocxChats, error } = await supabase
        .from('studyHubPDF')
        .select("*")
        .eq('user_id', user_id)
    console.log(error)
    if (error !== null) return { success: false }
    return { success: true, data: DocxChats }
}



export const AddVideoInSupabase = async (uuid: any, selectedFile: any, userId: any) => {
    const supabase = clientConnectionWithSupabase()
    const result: any = await supabase.storage.from('StudyHub_videos').upload(`${userId}/${uuid}.pdf`, selectedFile);
    if (result?.error !== null) {
        return { success: false, error: result.error.message }
    } else {
        const { data, error } = await supabase
            .from('studyHubPDF')
            .insert([
                { name: selectedFile.name, id: uuid, user_id: userId , chatted:false , chats:[{server:'Hello, How can i help you ?'}]},
            ])
            .select()
        if (error === null) return { success: false }
        return { success: true }
    }
}


export const GetVideoFromSupabase = async (id: string,user_id:string) => {
    const supabase = clientConnectionWithSupabase()
    let { data: studyHubPDF, error } = await supabase
    .from('studyHubPDF')
    .select("*")
    .eq('id', id)
    if (error !== null) return { success: false, error: error.message }
    else return { success: true, data: studyHubPDF[0] }
}



export const updatePDFChat = async (chats: any, id: any) => {
    const supabase = clientConnectionWithSupabase()
    const { data: updateData, error: updateError }: any = await supabase
        .from('studyHubPDF')
        .update({ chats: chats })
        .eq('id', id)
        .select()
    console.log(updateError)
    if (updateError !== null) return { success: false, error: updateError.message }
    return { success: true }
}


export const uploadPdfFile = async(file:any)=>{
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response:any = await fetch(`${URL}/docxchat/ImportPdfData`, {
            method: 'POST',
            body: formData,
        });
        console.log(response)
        if (response.ok) {
            console.log('PDF successfully sent to server');
            return {success:true}
        } else {
            return {success:false , Error:response.Error}
        }
    }catch(error){
        return {success:false , Error:"Internal Server Error"}
    }
}

export const resetPinecone = async()=>{
    const resp = await fetch(`${URL}/docxchat/resetpinecone`)
    const res = await resp.json();
    return res;
}

export const getRawPdfFromSupabase = async(url:string)=>{
    const response = await fetch(url);
    if(!response.ok){
        return {"success":false}
    }
    const blob = await response.blob();
    const file = new File([blob], 'your-pdf-file.pdf', { type: 'application/pdf' });
    return {"success":true,file};
}


export const getSummarizedData = async(topic:string)=>{
    const formData = new FormData();
    formData.append('topic', topic);
    const response = await fetch(`${URL}/docxchat/getDocSummary`, {
        method: 'POST',
        // Remove the 'Content-Type': 'application/json', header
        body: formData, // Send the FormData
    });
    return await response.json();
}

export const getQuiz = async (topic:string , Totalquestions:any) =>{
    // const formData = new FormData();
    // formData.append("topic", topic); // Assuming `config.category.name` is your topic
    // formData.append("question", Totalquestions.toString());
    // const response = await fetch(`${URL}/docxchat/getQuiz`, {
    //     method: "POST",
    //     body: formData,
    // });
    // const res = await response.json();
    const quizdata:any = localStorage.getItem('quiz')
    const parsedData:any = JSON.parse(quizdata)
    const parsedD:any =  JSON.parse(parsedData.data)
    console.log(parsedD)
    return { success:true , data:parsedD}
    // return res
}

export const getChatResponse = async (message:string , language:string ,recentChats:any )=>{
    const formData = new FormData();
    formData.append("message", message);
    formData.append("language", 'English');
    const recentChatsJson = JSON.stringify(recentChats);
    formData.append("recentChats",recentChatsJson)
    const response = await fetch(`${URL}/docxchat/documentChat`, {
        method: "POST",
        body: formData,
    });
    return await response.json();
}