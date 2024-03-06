import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateRecipe = () => {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const [cookies] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/${recipeId}`);
        setRecipe({
          ...response.data,
          ingredients: response.data.ingredients.join(", "),
        });
      } catch (err) {
        console.log(err);
      }
    };
    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event) => {
    setRecipe({ ...recipe, ingredients: event.target.value.split(",") });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Preparar los datos para ser enviados, teniendo en cuenta si ingredients es un array o una string
    let dataToSend = {
      ...recipe,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : recipe.ingredients.split(","),
      userOwner: userID,
    };

    try {
      const method = recipeId ? 'patch' : 'post';
      const url = recipeId ? `http://localhost:3001/recipes/${recipeId}` : "http://localhost:3001/recipes";

      const response = await axios[method](url, dataToSend, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      });

      alert(recipeId ? "¡Receta actualizada con éxito!" : "¡Receta creada con éxito!");
      navigate("/");
    } catch (error) {
      console.error("Failed to submit the recipe", error);
    }
  };

  return (
    <div className="create-recipe">
      <h2>{recipeId ? "Editar Recipe" : "Crear Receta"}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
        />
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={recipe.description}
          onChange={handleChange}
        />
        <label htmlFor="ingredients">Ingredientes (separados por comas)</label>
        <input
          type="text"
          id="ingredients"
          name="ingredients"
          value={typeof recipe.ingredients === 'string' ? recipe.ingredients : recipe.ingredients.join(", ")}
          onChange={handleIngredientChange}
        />
        <label htmlFor="instructions">Instructiones</label>
        <textarea
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
        />
        <label htmlFor="imageUrl">Imagen URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={recipe.imageUrl}
          onChange={handleChange}
        />
        <label htmlFor="cookingTime">Tiempo de horneado (minutos)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
        />
        <button className="boton-crear" type="submit">{recipeId ? "Editar Recipe" : "Crear Receta"}</button>
      </form>
    </div>
  );
};
