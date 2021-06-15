import style from "./Catalogue.module.css";
import React, {useState, useEffect} from "react";
import Card from './Card/Card.jsx';
import ReactPaginate from "react-paginate";
import {useDispatch, useSelector} from 'react-redux'
import { HiArrowCircleLeft,HiArrowCircleRight } from "react-icons/hi";

//import {getShirts} from '../../Actions/Actions'
import {getShirts} from '../../Actions/index'

import SideBar from './SideBar/SideBar'
import { SideCart } from "../Cart/SideCart";
import Filter from "./SideBar/Filter";


// {title, price, width, height, model, color}

const INITIAL_PAGE= 9;

function Catalogue(){
    
    const dispatch= useDispatch()
    const allShirts= useSelector(state => state.shirtReducer.allShirts)
    const shirtsByName= useSelector(state => state.shirtReducer.shirtsByName)
    const filteredByCategory= useSelector(state => state.shirtReducer.filteredByCategory)
    
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState([]);


    useEffect(()=>{
        /* if (shirtsByName.length === 0){
            dispatch(getShirts("true"))
            return;
        } */

        filteredByCategory?.length>0 ? setData(filteredByCategory) : shirtsByName.length>0 ? setData(shirtsByName) : setData(allShirts)

    }, [filteredByCategory, shirtsByName, allShirts])

   /*  useEffect(() => {
        filteredByCategory?.length>0 ? setData(filteredByCategory) : shirtsByName.length>0 ? setData(shirtsByName) : setData(allShirts)
    }, [filteredByCategory, shirtsByName, allShirts]) */

    function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
    window.scrollTo(0, 0)
    }

    /*  <button onClick={()=>dispatch(getShirts())}></button>
    '/status?=pending' */
    const offset = currentPage * INITIAL_PAGE;
    console.log(data)
    const filteredShirts = data.filter(shirt => shirt.status !== 'deleted' && shirt.public === 'true')
    const currentPageData = filteredShirts
    .sort((a, b) => {return b.id - a.id})
    .slice(offset, offset + INITIAL_PAGE)
    .map((e) => {
        return (        
            <Card          
                title= {e.name}            
                price= {e.price}
                size= {e.size}
                model= {e.model}
                color= {e.color}
                image= {e.print}
                score= {e.score}   
                id={e.id} 
                latestPrice={ parseInt(e.discount.split('/')[1]) > 0 ? <div >SALE !</div> : false }
                stock= {e.stock} 

            />    
        )
    })
  
    

  const pageCount = Math.ceil(data.length / INITIAL_PAGE);

    /* console.log(allShirts, shirtsByName, filteredByCategory) */

    return (
        <div className={style.container1}>
        
            
            <div className={style.sideBar}>
                <Filter/>
            </div>
            <div className={style.box}>
                <div className={style.shirts}>
                {
                    currentPageData
                }
                </div>
                <div className={style.pages}>
                    <ReactPaginate
                        previousLabel={<HiArrowCircleLeft/>}
                        nextLabel={<HiArrowCircleRight/>}
                        pageCount={data < INITIAL_PAGE ? 1 : pageCount}
                        onPageChange={handlePageClick}        
                        previousLinkClassName={style.pagination__link}
                        nextLinkClassName={style.pagination__link}
                        disabledClassName={style.pagination__link__disabled}
                        activeClassName={style.pagination__link__active}
                        containerClassName={style.pagination}
                    />
                </div>

        </div>
        
           {/*  <SideCart/> */}
        

        </div>   
    )
}

export default Catalogue