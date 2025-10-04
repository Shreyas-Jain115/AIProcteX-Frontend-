import axiosInstance from "./axiosSetup"

export const putTestcase = async(data) =>{
    try{
        const response = await axiosInstance.post('testcases',data);
        return response.data;
    }catch(e){
        console.log("Testcase post error",e);
        throw e;
    }
}

export const getTestCases = async () =>{
    try{
        const response = axiosInstance.get('testcases');
        return response.data;
    }
    catch(e){
         console.log("Testcase get error",e);
        throw e;
    }
}

export const FindTestCase = async(id) =>{
    try{
        const response = await axiosInstance.get(`testcases/question/${id}`);
        return response.data;
    }
    catch(e){
        console.log("Testcase get error",e);
        throw e;
    }
}