import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

const CategoryContext = createContext();

export const CategoryProvider = ({children}) => {
  const {token} = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [token]);

  const handleAddCategory = async (category) => {
    try{
      const response = await axios.post('/api/category', category, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setCategories([...categories, response.data.category]);
      toast.success('Category added successfully')
    }
    catch(error){
      console.error('Error adding category', error)
      toast.error('Error adding category')
    }
  }

  const handleAddSubCategory = async (subCategory) => {
    if (!selectedCategory) return;

    try {
      const response = await axios.post(`/api/category/${selectedCategory.id}/subcategory`, subCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCategory((prev) => ({
        ...prev,
        subCategories: [...prev.subCategories, response.data.subCategory],
      }));
      toast.success('Subcategory added successfully');
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast.error('Error adding subcategory');
    }
  };

  const handleAddChildCategory = async (childCategory) => {
    if (!selectedSubCategory) return;

    try {
      const response = await axios.post(`/api/category/${selectedCategory.id}/subcategory/${selectedSubCategory.id}/childcategory`, childCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedSubCategory((prev) => ({
        ...prev,
        childCategories: [...prev.childCategories, response.data.childCategory],
      }));
      toast.success('Child category added successfully');
    } catch (error) {
      console.error('Error adding child category:', error);
      toast.error('Error adding child category');
    }
  };


  const handleRemoveCategory = async (id) => {
    try {
      await axios.delete(`/api/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.info('Category removed successfully');
    } catch (error) {
      console.error('Error removing category:', error);
      toast.error('Error removing category');
    }
  };

  const handleRemoveSubCategory = async (subCategoryId) => {
    if (!selectedCategory) return;

    try {
      await axios.delete(`/api/category/${selectedCategory.id}/subcategory/${subCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCategory((prev) => ({
        ...prev,
        subCategories: prev.subCategories.filter((sub) => sub.id !== subCategoryId),
      }));
      toast.info('Subcategory removed successfully');
    } catch (error) {
      console.error('Error removing subcategory:', error);
      toast.error('Error removing subcategory');
    }
  };

  const handleRemoveChildCategory = async (childCategoryId) => {
    if (!selectedCategory || !selectedSubCategory) return;

    try {
      await axios.delete(`/api/category/${selectedCategory.id}/subcategory/${selectedSubCategory.id}/childcategory/${childCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedSubCategory((prev) => ({
        ...prev,
        childCategories: prev.childCategories.filter((child) => child.id !== childCategoryId),
      }));
      toast.info('Child category removed successfully');
    } catch (error) {
      console.error('Error removing child category:', error);
      toast.error('Error removing child category');
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        handleAddCategory,
        handleAddSubCategory,
        handleAddChildCategory,
        handleRemoveCategory,
        handleRemoveSubCategory,
        handleRemoveChildCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );

}

export const useCategory = () => useContext(CategoryContext)