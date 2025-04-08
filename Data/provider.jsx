import React, { createContext, useState, useEffect, useContext } from 'react';
import { initialProjects } from "./initialProjects"; 
import { jwtDecode } from 'jwt-decode';
import imageCompression from 'browser-image-compression';
import axios from "axios";



// api adress
const apiAdress = "https://localhost:7199/api/Item";

// יצירת ה-Context
const ProjectsContext = createContext();  // השם צריך להיות ProjectsContext

// קומפוננטה לספק את המידע לכל האפליקציה
export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

 
const MAX_RETRIES = 10; 
const RETRY_DELAY = 3000; 

const fetchData = async (retryCount = 0) => {
  try {
    const response = await fetch(`${apiAdress}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const datajson = await response.json();
    console.log("data: ", datajson);

    setProjects(datajson);
    setIsConnected(true);
  } catch (error) {
    console.error(`Error fetching data (attempt ${retryCount + 1}): `, error);

    if (retryCount < MAX_RETRIES) {
      setTimeout(() => fetchData(retryCount + 1), RETRY_DELAY);
    } else {
      console.log("Max retries reached, loading initial data...");
      setProjects(initialProjects);
      setIsConnected(false);
    }
  }
};

// initialize fetchData
useEffect(() => {
  fetchData();
}, []);



  const checkTokenValidity = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setIsConnected(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token); 
      const currentTime = Date.now() / 1000; 
      if (decodedToken.exp > currentTime) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
        localStorage.removeItem("jwtToken"); 
      }
    } catch (error) {
      console.error("Invalid token:", error);
      setIsConnected(false);
    }
  };

  // initialize checkTokenValidity
  useEffect(() => {
    checkTokenValidity();
  }, []);



  const convertProjectToFormData = async (project) => {
    const formData = new FormData();
    console.log("Id before:", project.id);
    // מוסיף את כל השדות לפרויקט באופן דינמי
    Object.keys(project).forEach((key) => {
        if (key !== "images") {
            formData.append(key, project[key]);
        }
    });

    // טיפול בתמונות
    // חשוב!!!!:
    // להוסיף אופציה לכיווץ תמונה
    const imagePromises = project.images.map(async (image, index) => {
      if (image.startsWith("blob:")) {
          const res = await fetch(image);
          const blob = await res.blob();

          const compressedBlob = await imageCompression(blob, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });

          formData.append("Images", compressedBlob, `image_${index}.jpg`);
          formData.append(`ImageUrls[${index}]`, "[EMPTY]"); // תא ריק לקישור שיווצר בשרת
      } else {
          formData.append(`ImageUrls[${index}]`, image); // קישור קיים
      }
  });

    // מחכים שכל התמונות יתאפסו עליהם
    await Promise.all(imagePromises);
    
    return formData;
};

  


  ////////////////// User actions //////////////////

  const addProject = async (project) => {
    console.log("before : "+JSON.stringify(project, null, 2));
      const token = localStorage.getItem("jwtToken");       
      const updatedProject = await convertProjectToFormData(project);      

      try {
        const response = await axios.post(`${apiAdress}`, updatedProject, {
          headers: {
            Authorization: `Bearer ${token}`, // מוסיפים את ה-Token ל-Headers
            //"Content-Type": "application/json", // סוג התוכן הוא JSON (לא מתאים כשאני צריך לשלוח בתור formdata)
          },
        });
        console.log("p: "+updatedProject + " | "+ JSON.stringify(updatedProject, null, 2));
        console.log("Item added:", response.data);
        setProjects(response.data);
        alert("Item added successfully!");
      } catch (error) {
        console.error("Failed to add item:", error.response?.data || error.message);
        alert("Failed to add item! Check your input or token.");
      }
  };


  const editProject = async (project) => {
      const token = localStorage.getItem("jwtToken");
      const updatedProject = await convertProjectToFormData(project);
      
      try {
        const response = await axios.put(`${apiAdress}`, updatedProject, {
          headers: {
            Authorization: `Bearer ${token}`, // מוסיפים את ה-Token ל-Headers
          },
        });
    
        console.log("Item updated:", response.data);
        setProjects(response.data);
        alert("Item updated successfully!");
      } catch (error) {
        console.error("Failed to update item:", error.response?.data || error.message);
        alert("Failed to update item! Check your input or token.");
      }
  };


  const deleteProject = async (itemId) => {
    const token = localStorage.getItem("jwtToken"); // קבלת ה-Token מה-Local Storage
  
    try {
      const response = await axios.delete(`${apiAdress}/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // מוסיפים את ה-Token ל-Headers
        },
      });
  
      console.log("Item deleted:", response.data);
      setProjects(response.data);
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Failed to delete item:", error.response?.data || error.message);
      alert("Failed to delete item! Check your permissions or token.");
    }
  };

  
  const logIn = async (user) => {
    try {
      const response = await axios.post(`${apiAdress}/login`, {
        userName: user.username,
        passwordHash: user.password,
      });

      const token = response.data; // ה-JWT Token מהשרת
      localStorage.setItem("jwtToken", token); // שומרים את ה-Token ב-Local Storage
      setIsLoggedIn(true);
      alert("Login successful!");
    } catch (error) {
      setIsLoggedIn(false);
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed! Check your credentials.");
    }
  };
  
  
  return (
    <ProjectsContext.Provider value={{ projects,isConnected, isLoggedIn, logIn, addProject, editProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
}

// הוק לשימוש ב-Context
export function useProjects() {
  return useContext(ProjectsContext);  // צריך להתאים ל-ProjectsContext
}
