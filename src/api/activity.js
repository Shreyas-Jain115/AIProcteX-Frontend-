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