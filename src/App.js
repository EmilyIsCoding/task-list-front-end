import React, { useEffect } from 'react';
import TaskList from './components/TaskList.js';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

const kBaseUrl = 'http://localhost:5000';

/* eslint-disable camelcase */
const convertFromApi = (apiTask) => {
  const { is_complete, ...rest } = apiTask;

  const newTask = { isComplete: is_complete, ...rest };
  return newTask;
};
/* eslint-enable camelcase */

const getAllTasksApi = () => {
  return axios
    .get(`${kBaseUrl}/tasks`)
    .then((response) => {
      return response.data.map(convertFromApi);
    })
    .catch((err) => {
      console.log(err);
    });
};

const toggleCompleteApi = (id, isComplete) => {
  if (!isComplete) {
    return axios
      .patch(`${kBaseUrl}/tasks/${id}/mark_complete`)
      .then((response) => {
        console.log(response.data);
        return convertFromApi(response.data.task);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return axios
    .patch(`${kBaseUrl}/tasks/${id}/mark_incomplete`)
    .then((response) => {
      console.log(response.data);
      return convertFromApi(response.data.task);
    })
    .catch((error) => {
      console.log(error);
    });
};

const removeTaskApi = (id) => {
  return axios
    .delete(`${kBaseUrl}/tasks/${id}`)
    .then((response) => {
      console.log(response);
      // return convertFromApi(response.data.task);
    })
    .catch((error) => {
      console.log(error);
    });
};

const App = () => {
  const [taskData, setTaskData] = useState([]);

  const getAllTasks = () => {
    return getAllTasksApi().then((tasks) => {
      setTaskData(tasks);
    });
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const toggleComplete = (id, isComplete) => {
    return toggleCompleteApi(id, isComplete).then((taskResult) => {
      setTaskData((taskData) =>
        taskData.map((task) => {
          if (task.id == taskResult.id) {
            return taskResult;
          } else {
            return task;
          }
        })
      );
    });
  };

  const removeTask = (id) => {
    return removeTaskApi(id).then((taskResult) => {
      taskData.filter((task) => {
        return task.id !== id;
      });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <div>
          <TaskList
            tasks={taskData}
            onComplete={toggleComplete}
            onRemove={removeTask}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
