import React from "react";
import style from "./Reviews.module.css";
import { getShirtReview, postShirtReview, getShirtScore, deleteReview} from "../../Actions/index.js";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useLayoutEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";


import {useTokenDecode} from '../../hooks/tokenDecoding';
import {useHistory} from 'react-router-dom'
import defaultImg from '../../Images/no_user_image.png'

function Reviews(props) {
  const dispatch = useDispatch();
  const review = useSelector((state) => state.reviewsReducer.reviews);
  
  const history = useHistory();
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const isAdmin = useTokenDecode(localStorage.currentToken);
  let id = props.match.params.id;
  let userData = user;
  const [counter, setCounter] = useState(0)  
  const [input, setInput] = useState({
    content: "",
    name: "",
    image: "",
    scoreReview: 0
  });

  useEffect(() => {
    
      dispatch(getShirtReview(id));
    
    }, [counter]);

  function handleSubmit(e) {
   e.preventDefault();
    if (parseInt(input.scoreReview) < 1){
      alert('choose at least 1 star')
    } 
    if (!isAuthenticated){
      alert("you must be signed up to post a review");
    }
    if (isAuthenticated && parseInt(input.scoreReview ) > 0 ) {
   
      dispatch(postShirtReview(input, id, userData.sub.split("|")[1]));
      setCounter(prevState => prevState+1)      
      setInput({
        content: "",
        name: "",
        image: "",
        scoreReview: 0
      })
      dispatch(getShirtReview(id));
    
    } 
   
  }

  function handleChange(e) {
    const content = e.target.value;
    const name = userData.name;
    const image = userData.picture;
    setInput({
      ...input,
      content,
      name,
      image,
    });
  }
  function handleChangeStart(e) {
    const scoreReview = parseInt(e.target.value);
    setInput({
      ...input,
      scoreReview
    })
  }
  function handleDelete (e){
    
    setCounter(prevState => prevState+1)      
    let idReview = parseInt(e.target.value)
    dispatch(deleteReview(idReview))  
    dispatch(getShirtReview(id));  
}
  // function getPromedio(){
  //   let stateCopy = [...usuarios];  
  //   let datasetSum = stateCopy.reduce((a,b) => a + parseInt(b.scoreReview),0);
  //   let p = Math.round(datasetSum/stateCopy.length);
    
  //   setPromedio(p);
  //   }
    
  return (
    <div className={style.customer_feedback}>
      <div className={style.container - style.text_center}>
        <div className={style.row}>
          <div className={style.col_sm_offset_2 - style.col_sm_8}>
            <div>
              <h2 className={style.section_title}>What Clients Say</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="container_12">
            <p>
              <textarea
                className="b3"
                name="steps"
                rows="10"
                cols="50"
                onChange={handleChange}
                required
              ></textarea>
            </p>
            <div>
            <p class={style.clasificacion}  onChange={handleChangeStart} >
                  <input id="radio1"  type="radio" name="star" value="5"  className={style.star} style={{display:'none'}} />
                  <label for="radio1">★</label>
                  <input id="radio2" type="radio" name="star" value="4" className={style.star}style={{display:'none'}}/>
                  <label for="radio2">★</label>
                  <input id="radio3" type="radio" name="star" value="3"className={style.star}style={{display:'none'}}/>
                  <label for="radio3">★</label>
                  <input id="radio4" type="radio" name="star" value="2"className={style.star}style={{display:'none'}}/>
                  <label for="radio4">★</label>
                  <input id="radio5" type="radio" name="star" value="1" className={style.star}style={{display:'none'}}/>
                  <label for="radio5">★</label>
                </p>
                </div>
            <input type="submit" value="SUBMIT" />
          
          </form>
       
        </div>

        {review.length > 0 ?
          review?.map((e) => {
            return (
              <div className={style.row} >              
                <div className={style.col_md_offset_3}>                
                  <div className={style.owl_carousel}>
                    <div className={style.feedback_slider_item}>
                      <img
                        src={e.image || defaultImg}
                        className={e.image ? style.userimage : style.defaultImg}
                        alt="Customer Feedback"
                      />
                      {/* <button style={{display: ${isAdmin ? flex : none}}} */}
                      { isAuthenticated && isAdmin ? <button onClick={handleDelete} 
                      value={e.id} >X</button> : ''  }
                      <div>
                        <h3 className={style.customer_name}>{e.name}</h3>
                        <p className={style.b3}>{e.content}</p>
                      </div>
                    </div>
                     
                  </div>
                </div>
              </div>
            );
          }) : <p>no hay nada</p>
         }
      </div>
    </div>
  );
}

export default Reviews;
