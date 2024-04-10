import axios from '../utils/http'
//药品管理相关

const BASE_URL = '/api'; // 后端 API 的基本路径是 '/api'

export const fetchMedicines = async () => {
    try {
        const response = await axios.get('/api/medicines', {
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,
            name_keyword: this.searchText.trim()
          },
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        });
        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
          this.medicines = response.data.data.records;
        } else {
          console.error('Error fetching medicines: Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
};
// export const medicineInfoRequest=()=>{
//     return axios.get(`/medicines`)
// }