import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import "./ArticlesEdit.scss";
import axios from "axios";
import Swal from 'sweetalert2'

import { createStructuredSelector } from "reselect";
import { currentUserSelect } from "../../redux/user/user-selector"

function ArticlesEdit({ currentUserData }) {

  // const { currentUserData } = props
  //該使用者id
  // const currentUserId = currentUserData ? currentUserData.memberId : ''
  // console.log(currentUserData)
  const { id } = { ...currentUserData }
  const [Data, setData] = useState("");
  const [delData, setDelData] = useState("")
  const [mId, setMId] = useState("")
  // console.log(delData);
  // const userId = useParams().memberId;
  // console.log(userId);

  useEffect(() => {
    const FetchData = async () => {
      const result = await axios(
        `http://localhost:5000/api/articles/member/${mId}`
      );
      setData(result.data);
      // console.log(result)
    };
    FetchData();
  }, [delData, mId]);

  useEffect(() => {

    setMId(id)
  }, [id])


  async function articleDataDelete(id) {
    // console.log(userId);
    // 開啟載入指示
    // setDataLoading(true)

    // 注意header資料格式要設定，伺服器才知道是json格式
    const request = new Request(
      `http://localhost:5000/api/articles/articlesEdit/${id}`,
      {
        method: "DELETE",
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "appliaction/json",
        }),

      },
    );

    // window.location.reload()
    const response = await fetch(request);
    const data = await response.json();
    // console.log(data);
    setDelData(data);

  }


  return (
    <>
      <div className="articleContainer">
        <div className="edit-list-container">
          <ul className="edit-list">
            <li>文章編號</li>
            <li>文章標題</li>
            <li>文章內容</li>
            <li>功能</li>
          </ul>
        </div>
        {Data
          ? Data.map((list, index) => (
            <div className="articleItem" key={index}>
              <ul className="articleList">
                <li className="articleListId">{list.articleId}</li>
                <li className="articleListTitle">{list.articleTitle}</li>
                <li className="articleListContent">{list.articleContent}</li>
                <div className="features">
                  <Link to={`/ArticlesUpdate/${list.articleId}`}>
                    <button>編輯</button>
                  </Link>
                  <button onClick={() => Swal.fire({
                    title: '刪除文章',
                    text: "刪除後無法還原文章",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '確定',
                    cancelButtonText: '取消'
                  }).then((result) => {
                    if (result.value) {
                      Swal.fire(
                        '完成!',
                        '文章已刪除',
                        'success'
                      ).then(() => { (articleDataDelete(list.articleId)) })
                    }
                  })
                  }>刪除</button></div>
              </ul>
            </div>
          ))
          : ""}
      </div>
    </>
  );
}
const mapStateToProps = createStructuredSelector({
  currentUserData: currentUserSelect,
});
export default withRouter(connect(mapStateToProps)(ArticlesEdit));