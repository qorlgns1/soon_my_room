import React, { useRef, useState, useEffect } from 'react';
import LoginTitle from '../components/login/LoginTitle';
import InputBox from '../components/input/InputBox';
import styled from 'styled-components';
import LongBtn from '../components/login/LongBtn';
import ErrorMessageBox from '../components/input/ErrorMessageBox';
import Profile from '../components/profileImg/Profile';

const Form = styled.form`
  width: 322px;
  margin: 0 auto;
`;

export default function ProfileSettingPage(props) {
  const [manageUserName, setManageUserName] = useState({
    errorMessage: '',
    isValid: false,
  });

  const [manageUserId, setManageUserId] = useState({
    errorMessage: '',
    isValid: false,
  });

  const [userIntroduceValidMessage, setUserIntroduceValidMessage] =
    useState('');

  const [userIntroduceValid, setUserIntroduceValid] = useState(false);

  const userNameRef = useRef('');
  const userIdRef = useRef('');
  const userIntroduceRef = useRef('');

  const [userEmail, setUserEmail] = useState('');
  const [userPw, setUserPw] = useState('');

  const handleUserNameValidCheck = ({ target }) => {
    const userNameLength = target.value.length;
    if (userNameLength < 2 || userNameLength > 10) {
      setManageUserName({
        errorMessage: '*2~10자 이내여야 합니다.',
        isValid: false,
      });
      return;
    }

    setManageUserName({
      errorMessage: '',
      isValid: true,
    });
  };

  const handleUserIdValidCheck = ({ target }) => {
    const userId = target.value;
    const validCheck = /^[a-zA-Z0-9._]*$/;

    if (!userId) {
      setManageUserId({
        errorMessage: '*계정 ID를 입력해 주세요.',
        isValid: false,
      });
      return;
    }

    if (!validCheck.test(userId)) {
      setManageUserId({
        errorMessage: '*영문, 숫자, 특수문자(.),(_)만 사용 가능합니다.',
        isValid: false,
      });
      return;
    }

    setManageUserId({
      errorMessage: '',
      isValid: true,
    });
  };

  const handleUserIntroduceValidCheck = ({ target }) => {
    const userIntroduce = target.value;
    if (!userIntroduce) {
      setUserIntroduceValidMessage('*소개를 입력해 주세요.');
      setUserIntroduceValid(false);
      return;
    }

    setUserIntroduceValidMessage('');
    setUserIntroduceValid(true);
  };

  const userIdValidCheck = async () => {
    const url = 'https://mandarin.api.weniv.co.kr';

    try {
      const path = '/user/accountnamevalid';
      const res = await fetch(`${url}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            accountname: userIdRef.current.value,
          },
        }),
      });

      const { message } = await res.json();

      if (message === '이미 가입된 계정ID 입니다.') {
        setManageUserId({
          errorMessage: '*이미 가입된 계정ID 입니다.',
          isValid: false,
        });
        userIdRef.current.focus();
        return;
      }

      if (message === '잘못된 접근입니다.') {
        setManageUserId({
          errorMessage: '*잘못된 접근입니다.',
          isValid: false,
        });
        return;
      }

      if (!message) {
        setManageUserId({
          errorMessage: '*관리자에게 문의해주세요.',
          isValid: false,
        });
        return;
      }

      return true;
    } catch (err) {
      console.error(err);
    }
  };

  const saveUserImage = async () => {
    const file = document.getElementById('imgUpload').files;

    const url = 'https://mandarin.api.weniv.co.kr';

    if (!file.length) {
      const defaultImageUrl = `${url}/1657196670849.png`;
      return defaultImageUrl;
    }

    const formData = new FormData();
    formData.append('image', file[0]);
    try {
      const path = '/image/uploadfile';
      const response = await fetch(`${url}${path}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      const uploadImageUrl = `${url}/${data.filename}`;
      return uploadImageUrl;
    } catch (err) {
      console.error(err);
    }
  };

  const join = async () => {
    const url = 'https://mandarin.api.weniv.co.kr';
    const imageUrl = await saveUserImage();

    try {
      const path = '/user';
      const res = await fetch(`${url}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username: userNameRef.current.value,
            email: userEmail,
            password: userPw,
            accountname: userIdRef.current.value,
            intro: userIntroduceRef.current.value,
            image: imageUrl,
          },
        }),
      });

      const joinResult = await res.json();
      return joinResult;
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartMarketClick = async (e) => {
    e.preventDefault();

    const userIdValidResult = await userIdValidCheck();
    if (!userIdValidResult) {
      return;
    }

    const joinResult = await join();
    if (joinResult.message === '회원가입 성공') {
      props.history.push('/login');
    } else {
      alert(joinResult.message);
    }
  };

  useEffect(() => {
    if (props?.location?.state) {
      const { userEmail, userPw } = props.location.state;
      setUserEmail(userEmail);
      setUserPw(userPw);
    } else {
      props.history.push('join');
    }
  }, []);

  return (
    <>
      <LoginTitle subTxt>프로필 설정</LoginTitle>
      <Form>
        <Profile />
        <InputBox
          useRef={userNameRef}
          onChange={handleUserNameValidCheck}
          id='userName'
          labelText='사용자 이름'
          placeholder='2~10자 이내여야 합니다.'
        />
        {manageUserName.errorMessage && (
          <ErrorMessageBox>{manageUserName.errorMessage}</ErrorMessageBox>
        )}
        <InputBox
          useRef={userIdRef}
          onChange={handleUserIdValidCheck}
          id='userId'
          labelText='계정 ID'
          placeholder='영문, 숫자, 특수문자(.),(_)만 사용 가능합니다.'
        />
        {manageUserId.errorMessage && (
          <ErrorMessageBox>{manageUserId.errorMessage}</ErrorMessageBox>
        )}
        <InputBox
          useRef={userIntroduceRef}
          onChange={handleUserIntroduceValidCheck}
          id='userIntroduce'
          labelText='소개'
          placeholder='자신과 판매할 상품에 대해 소개해 주세요!'
        />
        {userIntroduceValidMessage && (
          <ErrorMessageBox>{userIntroduceValidMessage}</ErrorMessageBox>
        )}
        <LongBtn
          disabled={
            !(
              manageUserName.isValid &&
              manageUserId.isValid &&
              userIntroduceValid
            )
          }
          onClick={handleStartMarketClick}
        >
          감귤마켓 시작하기
        </LongBtn>
      </Form>
    </>
  );
}
