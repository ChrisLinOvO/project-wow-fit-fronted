import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
//---------------
import { createStructuredSelector } from "reselect";
import { currentUserSelect } from "../../redux/user/user-selector"
//---------------

import "./CourseBox.scss";

import CJumpWindow from "../c-jump-window/CJumpWindow";
import SJumpWindow from "../s-jump-window/SJumpWindow";
<<<<<<< HEAD
import CourseBookingButton from "../course-booking-button/CourseBookingButton";

function CourseBox(props) {
    //---------------
    const { currentUserData } = props
    //該使用者的id
    const currentUserId = currentUserData ? currentUserData.memberId : ''
    //---------------

    // console.log(props.course)
    // console.log(currentUserData)

    const [cModalShow, setCModalShow] = useState(false);
    const [sModalShow, setSModalShow] = useState(false);
    //原本資料庫的bookingData
    const [bookingData, setBookingData] = useState('');
    //預約後存值
    const [newBookingData, setNewBookingData] = useState('')
    const [numOfCourse, setNumOfCourse] = useState(0)
    // const [newNumOfCourse, setNewNumOfCourse] = useState('')


    let t = [] = props.course.courseTime
    // console.log('t:', t)
    let newT = t.split(/[' ']/)[3]

    //Fetch 預約資料
    async function getBookingData() {
        const request = new Request("http://localhost:5000/api/courses/bookingData", {
            method: 'GET',
            body: JSON.stringify(),
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }),
        })
        const response = await fetch(request)
        const data = await response.json()
        setBookingData(data)
        setNumOfCourse(props.course.numberOfCourse)
        // console.log(A)
    }

    async function addBooking() {
        if (currentUserId !== '') {
            // 點擊預約後抓該id
            const getThisCourseId = props.course.courseId
            // console.log('c:', getThisCourseId)
            const coursesInLocal = JSON.parse(localStorage.getItem('courses'))
            //post新增預約到資料庫
            const bookingPost = {
                memberId: currentUserId,
                courseId: getThisCourseId
            }
            const request = new Request("http://localhost:5000/api/courses/bookingData", {
                method: 'POST',
                body: JSON.stringify(bookingPost),
                headers: new Headers({
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            const response = await fetch(request)
            const data = await response.json()
            setNewBookingData(data)
            // setChangeBtn(props.course.courseId)

            // if (!coursesInLocal) {

            //     // console.log('2')
            //     const newLocal = await localStorage.getItem('newC') ? JSON.parse(localStorage.getItem('newC')) : {
            //         courses: []
            //     }
            //     const newLocalFind = await newLocal && newLocal.filter(item => item.courseId === getThisCourseId).map(i => i)
            //     // console.log(newFind)
            //     //將課程人數+1
            //     newLocalFind[0].numberOfCourse += 1
            //     const newLocalNonFind = await newLocal && newLocal.filter(item => item.courseId !== getThisCourseId)
            //     // console.log(newLocalNonFind)
            //     newLocalNonFind.push(newLocalFind)
            //     await localStorage.removeItem('newC')
            //     //將新陣列存進localStorage
            //     await localStorage.setItem('newC', JSON.stringify(newLocalNonFind))
            //     // console.log('newLocalFind',newLocalFind[0].numberOfCourse)
            //     setNumOfCourse(newLocalFind[0].numberOfCourse)

            // } else {
            // console.log('1')

            //用課程id抓localStorage特定課程
            const newFind = await coursesInLocal.coursesRow && coursesInLocal.coursesRow.filter(item => item.courseId === getThisCourseId).map(i => i)
            // console.log(newFind)
            //將課程人數+1
            newFind[0].numberOfCourse += 1
            // console.log(newFind)

            //將其他未被選到的課程轉到新陣列
            const nonFind = await coursesInLocal.coursesRow && coursesInLocal.coursesRow.filter(item => item.courseId !== getThisCourseId)
            // console.log(nonFind)

            //將預定人數增加的資料推進新陣列
            await nonFind.push(newFind[0])
            // console.log(nonFind)

         

            // //刪除原本localStorage課程的data
            localStorage.setItem("courses",JSON.stringify({"coursesRow":nonFind}))
            // //將新陣列存進localStorage
            // await localStorage.setItem('newC', JSON.stringify(nonFind))
            // console.log('newFind',newFind[0].numberOfCourse)
            // setNumOfCourse(newFind[0].numberOfCourse)
        }
        // } else {
        //     alert('請先登入會員')
        // }
    }

    async function cancelBooking() {
        if (currentUserId !== '') {
            // 點擊預約後抓該id
            const getThisCourseId = props.course.courseId
            // console.log('c:', getThisCourseId)
            //該會員已預約過的預約Id
            const bookedId = bookingData && bookingData.filter(m => m.memberId === currentUserId).map(bookedCourse => (bookedCourse))
            // console.log(A)
            //該會員預約的課程id
            const B = bookedId && bookedId.filter(item => item.courseId === getThisCourseId)

            const cancelId = B[0].courseBookingId

            const bookingDel = {
                courseBookingId: cancelId,
                memberId: currentUserId,
                courseId: getThisCourseId
            }

            const request = new Request(`http://localhost:5000/api/courses/bookingData/${cancelId}`, {
                method: 'DELETE',
                body: JSON.stringify(bookingDel),
                headers: new Headers({
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            const response = await fetch(request)
            const data = await response.json()
            setNewBookingData(data)
            console.log('okk')
            // setChangeBtn(props.course.courseId)
        }

    }


    //初始render抓booking資料
    useEffect(() => {
        getBookingData()

    }, [newBookingData])

    return (
        <>
            <div className="courseBox">
                <div onClick={() => setCModalShow(true)}>{props.course.courseName}</div>
                <div className="courseTime">{newT}</div>
                <div onClick={() => setSModalShow(true)} className="coachName">
                    {props.course.Ename}
                </div>
                <div>{numOfCourse}/{props.course.courseQuoda}</div>
                <CourseBookingButton
                    value={props.course.courseId}
                    bookingData={bookingData}
                    currentUserId={currentUserId}
                    addBooking={addBooking}
                    cancelBooking={cancelBooking}
                />
            </div>
            <div className="jumpWindow">
                <CJumpWindow
                    show={cModalShow}
                    onHide={() => setCModalShow(false)}
                    courseName={props.course.courseName}
                    courseIntroduce={props.course.courseIntroduce}
                    courseImg={props.course.courseImg}
                />
                {sModalShow && (
                    <SJumpWindow
                        show={sModalShow}
                        onHide={() => setSModalShow(false)}
                        coachName={props.course.Ename}
                        //專長
                        coachExpertise={props.course.Eexpertise}
                        //證照
                        coachLicense={props.course.Elicense}
                        coachImg={props.course.Eimg}
                    />
                )}
            </div>
        </>
    );
=======
import { Link } from "react-router-dom";
// import ControllerButton from '../controller-button/controllerButton'

function CourseBox(props) {
  let t = props.course.courseTime;
  // console.log('t', t)
  // console.log(t.split(/[- T .]/))
  let newT = t.split(/[' ']/)[3];
  // console.log(newT)
  const [cModalShow, setCModalShow] = useState(false);
  const [sModalShow, setSModalShow] = useState(false);

  // console.log(props)

  async function bookingCourse() {
    // console.log('yeeee')
    //b = localStorage裡的資料
    const b = JSON.parse(localStorage.getItem("member"));

    //c = 點擊預約後抓該課程資料
    const c = [
      {
        courseId: props.course.courseId,
        staffId: props.course.staffId,
        courseName: props.course.courseName,
        courseCategoryName: props.course.courseCategoryName,
        courseTime: props.course.courseTime,
        courseHour: props.course.courseHour,
        numberOfCourse: props.course.numberOfCourse,
        courseQuoda: props.course.courseQuoda,
      },
    ];
    console.log("b:", b);
    console.log("c:", c);
    //將b跟c陣列中的物件合併
    // const d = Object.assign(b[0], c[0]);

    //將資料轉成json字串格式
    // await localStorage.setItem('member', JSON.stringify(d))
    // console.log(d)

    // const request = new Request("http://localhost:5000/api/insertCourse", {
    //   method: "POST",
    //   body: JSON.stringify(d),
    //   headers: new Headers({
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   }),
    // });

    // const response = await fetch(request)
    // const data = await response.json()
  }

  return (
    <>
      <div className="courseBox">
        <div onClick={() => setCModalShow(true)}>{props.course.courseName}</div>

        <div className="courseTime">{newT}</div>
        {/* <div className="courseTime">{props.course.staffId}</div> */}
        <div onClick={() => setSModalShow(true)} className="coachName">
          {props.course.Ename}
        </div>
        {/* <a onClick={} className="booking btn">已報名</a> */}
        {/* <a className="bookingFull btn">已額滿</a> */}
        <Link to={() => bookingCourse()} className="accessBooking btn">
          預約
        </Link>
      </div>
      <div className="jumpWindow">
        {cModalShow && (
          <CJumpWindow
            show={cModalShow}
            onHide={() => setCModalShow(false)}
            courseName={props.course.courseName}
            courseIntroduce={props.course.courseIntroduce}
            courseImg={props.course.courseImg}
          />
        )}
        {sModalShow && (
          <SJumpWindow
            show={sModalShow}
            onHide={() => setSModalShow(false)}
            coachName={props.course.Ename}
            //專長
            coachExpertise={props.course.Eexpertise}
            //證照
            coachLicense={props.course.Elicense}
            coachImg={props.course.Eimg}
          />
        )}
      </div>
    </>
  );
>>>>>>> 09100a9871d7748b28c121983476f364f059cc83
}
//---------------
const mapStateToProps = createStructuredSelector({
    currentUserData: currentUserSelect,
});

export default withRouter(connect(mapStateToProps)(CourseBox));
//---------------
