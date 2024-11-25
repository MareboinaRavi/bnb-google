import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { GoogleGenerativeAI } from "@google/generative-ai";

const RecipeFinder = () => {
  const [ingredientOne, setIngredientOne] = useState("");
  const [ingredientTwo, setIngredientTwo] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fetchRecipes = async () => {
    setLoading(true);
    setError("");
    setRecipes([]);

    try {
      const response = await model.generateContent([
        `
        Can you provide 5 recipes using ${ingredientOne} and ${ingredientTwo} as key ingredients? Return results as an array of objects containing: 
        - "recipeName" 
        - "ingredients" 
        - "process" 
        - "timeTaken".`,
      ]);

      const recipeData = JSON.parse(
        response?.response?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.replace(/```json|```/g, "")
          .trim()
      );

      setRecipes(recipeData);
    } catch (err) {
      setError("Failed to fetch recipes. Please try again.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI-Powered Recipe Finder
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          maxWidth: "500px",
          margin: "auto",
          marginBottom: 4,
        }}
      >
        <TextField
          label="Ingredient 1"
          value={ingredientOne}
          onChange={(e) => setIngredientOne(e.target.value)}
          fullWidth
        />
        <TextField
          label="Ingredient 2"
          value={ingredientTwo}
          onChange={(e) => setIngredientTwo(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchRecipes}
          disabled={loading}
          sx={{ minWidth: "200px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Find Recipes"}
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={2}>
        {recipes.map((recipe, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <b>Recipe:</b> {recipe?.recipeName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <b>Duration:</b> {recipe?.timeTaken}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <b>Ingredients:</b> {recipe?.ingredients?.join(", ")}
                </Typography>
                <Typography variant="body2">
                  <b>Process:</b> {recipe?.process?.join(", ")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {!loading && recipes.length === 0 && !error && (
        <Typography>No recipes found. Try different ingredients.</Typography>
      )}
    </Box>
  );
};

export default RecipeFinder;
