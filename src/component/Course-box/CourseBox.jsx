import React, { useState, useEffect } from "react";
import "./CourseBox.scss";
import CourseBookingButton from "../course-booking-button/CourseBookingButton";
import Swal from "sweetalert2";
//---------------
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { currentUserSelect } from "../../redux/user/user-selector";
//---------------


function CourseBox(props) {

    //---------------
    const { currentUser } = props
    //該使用者的id
    const currentUserId = currentUser ? currentUser.id : ''
    //---------------
    const [num, setNum] = useState([props.course.numberOfCourse])
    const [changeState, setChangeState] = useState(false)
    const [changeState2, setChangeState2] = useState(false)
    //    console.log( [props.course.numberOfCourse])
    // console.log(currentUser)`


    //將現在時間的星期轉換成毫秒
    const nowTime = Date.now()
    //抓資料裡的課程時間(毫秒)
    const getTimeInData = props.course.courseTime2
    let t = props.course.courseTime
    let newT = t.split(/[' ']/)[3]
    // 該課程id
    const getThisCourseId = props.course.courseId

    //新增人數到資料庫
    async function getAddNumFromData() {
        const addNumPost = {
            courseId: getThisCourseId,
        }
        const req = new Request("http://localhost:5000/api/courses/addNumOfCourse", {
            method: 'POST',
            body: JSON.stringify(addNumPost),
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
        })
        const res = await fetch(req)
        const newData = await res.json()
        return newData
    }

    //預約function
    async function addBooking() {
        const bookingPost = {
            memberId: currentUserId,
            courseId: getThisCourseId
        }
        const request = new Request("http://localhost:5000/api/courses/bookingData", {
            method: 'POST',
            body: JSON.stringify(bookingPost),
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
        })
        await fetch(request)

        // getNumFromData()
        props.getBookingData()
        setChangeState(!changeState)
    }

    //抓該會員預約過的課程資料
    const thisUserCourseId = props.bookingData && props.bookingData.filter(i => i.memberId === currentUserId).map(p => p)
    //抓要取消的預約編號
    const thisCanceld = thisUserCourseId && thisUserCourseId.filter(i => i.courseId === getThisCourseId).map(p => p.courseBookingId)
    // console.log(thisCanceld)

    //取消預約
    async function userCancelBooking() {
        const updateBookingJson = {
            bookingState: 0
        }
        const request = new Request(`http://localhost:5000/api/courses/bookingData/${thisCanceld}`, {
            method: 'POST',
            body: JSON.stringify(updateBookingJson),
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
        })
        await fetch(request)
        props.getBookingData()
        setChangeState2(!changeState2)
    }

    //取消預約後減少人數
    async function getReduceNumFromData() {
        const reduceNumJson = {
            courseId: getThisCourseId,
        }
        const req = new Request(`http://localhost:5000/api/courses/data`, {
            method: 'POST',
            body: JSON.stringify(reduceNumJson),
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
        })
        const res = await fetch(req)
        const newData = await res.json()
        // console.log(newData)
        return newData
    }

    //確認預約視窗
    function myConfirmAddBooking(addBooking) {
        let a = window.confirm("確定要預約此課程嗎?")
        if (currentUser !== '') {
            if (a === true) {
                addBooking()
                // window.location.reload()
            } else {
                console.log('nooo')
            }
        } else {
            alert("請先登入會員")
        }
    }
    //確認取消視窗
    function myConfirmCancelBooking(userCancelBooking) {
        let b = window.confirm("取消後無法重新預約，確定要取消嗎?")
        if (b === true) {
            userCancelBooking()
        } else {
            console.log('nooo')
        }
    }

    //已額滿按鈕
    const displayFullBtn = (
        <>
            <button value={props.value} className="fullBooking">已額滿</button>
        </>
    )

    //課程彈跳視窗
    function showCJumpWindow() {
        Swal.fire({
            width: 800,
            title: props.course.courseName,
            imageUrl: props.course.courseImg,
            imageWidth: 400,
            imageHeight: 300,
            text: props.course.courseIntroduce,
        })
    }
    //教練彈跳視窗
    function showEJumpWindow() {
        Swal.fire({
            width: 800,
            title: props.course.Ename,
            imageUrl: props.course.Eimg,
            imageWidth: 400,
            html: `<h4>證照：</h4></br>${props.course.Elicense}<br/><br/><h4>專長：</h4></br>${props.course.Eexpertise}`,
        })
    }

    useEffect(() => {
        (async () => {
            const getNumFunc = await getAddNumFromData()
            setNum([getNumFunc.numberOfCourse])
        })()
    }, [changeState])

    useEffect(() => {
        (async () => {
            const getReduceNumFunc = await getReduceNumFromData()
            setNum([getReduceNumFunc.numberOfCourse])
        })()
    }, [changeState2])

    return (
        <>
            <div className="courseBox">
                {getTimeInData <= nowTime ? <div className="courseBoxCover"></div> : ''}
                <div className="courseName" onClick={() => showCJumpWindow()}>{props.course.courseName}</div>
                <div className="courseTime">{newT}</div>
                <div onClick={() => showEJumpWindow()} className="coachName">
                    {props.course.Ename}
                </div>
                <div>{num.map(i => (i))}/{props.course.courseQuoda}</div>
                <div>
                    {+props.course.numberOfCourse >= +props.course.courseQuoda ? displayFullBtn :
                        <CourseBookingButton
                            value={props.course.courseId}
                            bookingData={props.bookingData}
                            addBooking={addBooking}
                            userCancelBooking={userCancelBooking}
                            myConfirmAddBooking={myConfirmAddBooking}
                            myConfirmCancelBooking={myConfirmCancelBooking}
                            thisUserBookingId={props.thisUserBookingId}
                        />
                    }
                </div>
            </div>
        </>
    );
}

//---------------
const mapStateToProps = createStructuredSelector({
    currentUser: currentUserSelect,
});

export default withRouter(connect(mapStateToProps)(CourseBox));
  //---------------


