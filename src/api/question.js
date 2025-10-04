import axiosInstance from "./axiosSetup";

export const getQuestions= async () =>{
    try{
        const response = await axiosInstance.get('questions');
        console.log(response.data);
        return response.data;
    }
    catch(e){
        console.log("Error Occurredd",e);
        throw e;
    }
}


export const PostData = async (data) => {
    try {
        const response = await axiosInstance.post('questions',data);
        console.log("Data Submitted from Api component",response);
        return response.data;
    }catch(e){
        console.log("Error Occured In Question compoenet",e);
        throw e;
    }
}

export const FindQuestionById = async(id) =>{
    try{
        const response = await axiosInstance.get(`questions/${id}`);
        return response.data;
    }
    catch(e){
        console.log("Error in fetching Data BY id",e);
        throw e;
    }
}