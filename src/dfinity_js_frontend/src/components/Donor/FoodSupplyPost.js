import React from "react";
import AddFoodContract from "./AddFoodContract";
import { createFoodContract } from "../../utils/foodshare";

const FoodSurplusPost = ({ offerFood, getAllFoodSurplusPosts, donorId }) => {
  const { postId, foodType, quantity, expiryDate, location, description } =
    offerFood;

  const handleAccept = async (data) => {
    try {
      await createFoodContract(data).then(async (response) => {
        // console.log("Food contract created: ", response);
        getAllFoodSurplusPosts();
      });
    } catch (error) {
      console.error("Error creating food contract: ", error);
    }
  };
  
  // Render the component within a table row (<tr>). This assumes it's directly placed within <tbody> in the parent component
  return (
    <tbody>
      <tr>
        <td>{description}</td>
        <td>{foodType}</td>
        <td>{quantity}</td>
        <td>{expiryDate}</td>
        <td>{location}</td>
        <td>
          <AddFoodContract
            save={handleAccept}
            postId={postId}
            donorId={donorId}
          />
        </td>
      </tr>
    </tbody>
  );
};

export default FoodSurplusPost;
