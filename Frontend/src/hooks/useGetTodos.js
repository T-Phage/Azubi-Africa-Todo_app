import { useState } from "react";
import { CustomErrorAlert } from "../utils/general.js";

import axios from "axios";

const useGetTodos = (setTodos, setNumOfPages, setPage) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async (page, limit) => {
    setIsLoading(true);
    console.log("Fetching todos for page:", page, "with limit:", limit);
    try {
      // const response = await fetch(
      //   // `https://fullstack-todolist-upnv.onrender.com/todos?page=${page}&limit=${limit}`
      //   `http://localhost:3000/api/gettodos?page=${page}&limit=${limit}`,
      // );
      // const data = await response.json();
      // console.log("Fetched todos:", await data.todos);
      const resp = await axios.get("http://localhost:3000/api/gettodos");
      console.log("Fetched todos:", resp.data);
      await setTodos(resp.data.todoList);
      await setNumOfPages(resp.data.numOfPages);
      if (page > resp.data.numOfPages) setPage(resp.data.numOfPages);
    } catch (error) {
      CustomErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchTodos, isFetchingTodos: isLoading };
};

export default useGetTodos;
