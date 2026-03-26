import axios from 'axios';

const API_BASE_URL = '/api/tasks';

export const taskApi = {
  async getAll(){
    try{
      const response = await axios.get(API_BASE_URL);
      return response.data;
    }catch (error){
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  async getById(id){
    try{
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    }catch (error){
      console.error('Error fetching task:', error);
      throw error;
    }
  },
  async create(taskData){
    try{
      const response = await axios.post(API_BASE_URL, taskData);
      return response.data;
    }catch (error){
      console.error('Error creating task:', error);
      throw error;
    }
  },
  async update(id, taskData){
    try{
      const response = await axios.patch(`${API_BASE_URL}/${id}`, taskData);
      return response.data;
    }catch (error){
      console.error('Error updating task:', error);
      throw error;
    }
  },
  async delete(id){
    try{
      await axios.delete(`${API_BASE_URL}/${id}`);
      return id;
    }catch (error){
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};