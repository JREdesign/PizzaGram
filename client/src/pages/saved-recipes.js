import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        // Asumiendo que tienes una endpoint específica para obtener las recetas guardadas
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/${userID}`);
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
        setSavedRecipes([]);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  return (
    <div>
      <h1>Recetas Guardadas</h1>
      <ul>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
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
