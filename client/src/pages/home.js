import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [saving, setSaving] = useState({});
  const navigate = useNavigate();
  const userID = useGetUserID();
  const [cookies] = useCookies(['access_token']);

  useEffect(() => {
    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/recipes");
      setRecipes(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
      );
      setSavedRecipes(response.data.savedRecipes || []);
    } catch (err) {
      console.log(err);
      setSavedRecipes([]);
    }
  };

  const saveRecipe = async (recipeID) => {
    setSaving(prev => ({ ...prev, [recipeID]: true }));
    try {
      await axios.put(
        `http://localhost:3001/recipes`,
        { recipeID, userID },
        { headers: { Authorization: `Bearer ${cookies.access_token}` } }
      );
      setSavedRecipes(prev => [...prev, recipeID]);
      fetchRecipes();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(prev => ({ ...prev, [recipeID]: false }));
    }
  };

  const deleteRecipe = async (recipeID) => {
    try {
      await axios.delete(`http://localhost:3001/recipes/${recipeID}`);
      setRecipes(recipes.filter(recipe => recipe._id !== recipeID));
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes && savedRecipes.includes(id);

  return (
    <div>
      <h1>Recetas</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button
                className="boton-guardar" 
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id) || saving[recipe._id]}
              >
                {isRecipeSaved(recipe._id) ? "Guardada" : "Guardar"}
              </button>
              <button className="boton-editar" onClick={() => navigate(`/create-recipe/${recipe._id}`)}>Editar</button>
              <button className="boton-borrar" onClick={() => deleteRecipe(recipe._id)}>Borrar</button>
            </div>
            <div className="ingredients">
              <h3>Ingredientes</h3>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <div className= "ingredients-list" key={index}>{ingredient}</div>
                ))}
              </ul>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Tiempo de Cocina: {recipe.cookingTime} minutos</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
