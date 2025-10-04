import axiosInstance from "./axiosSetup";

export const UploadLogs = async (data) =>{
    console.log("lOGGED DATA",data)
    try{
        const response = await axiosInstance.post('activities/save',data);
        console.log(response.data);
        return response.data;
    }
    catch(e){
        console.log("Error Occurredd",e);
        throw e;
    }
}

export const GetAllLogs = async (userId,TestId) =>{
    console.log("from GetAllLOGS count ",userId,TestId);
    try{
        const response = await axiosInstance.get(`activities/user/${userId}/test/${TestId}`);
        console.log(response.data);
        return response.data;
    }
    catch(e){
        console.log("Error Occurredd",e);
        throw e;
    }
}

export const GetErrorCount = async (userId,TestId) =>{
    console.log("from GetERror count ",userId,TestId);
    try{
        const response = await axiosInstance.get(`user-action-logs/user/${userId}/test/${TestId}`);
        console.log(response.data);
        return response.data;
    }
    catch(e){
        console.log("Error Occurredd",e);
        throw e;
    }
}

export const SaveErrorCounts = async (data) =>{
    console.log(" ERROR COUNT DATA",data)
    try{
        const response = await axiosInstance.post('user-action-logs/save',data);
        console.log(response.data);
        return response.data;
    }
    catch(e){
        console.log("Error Occurredd",e);
        throw e;
    }
}