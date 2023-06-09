import React, { useEffect, useState } from "react";
import InputLabel from "@component/AdminInputLabel/AdminInputLabel";
import { DataInput, CheckPassword } from "@action/hooks/Effectiveness";
import { useRecoilState } from "recoil";
import { adminState } from "@src/store/admin";
import * as style from "@component/Main/SignUpModal.style";
import AdminPrimaryButton from "@component/Adminpage/AdminPrimaryButton";
import { RegistUser } from "@src/action/hooks/User";
import { FindUserAll } from "@src/action/hooks/Admin";
import { toastListState } from "@src/store/toast";

type UserInfo = {
  onClose: () => void;
  handler: any;
};

const SignUpModal = ({ handler, onClose }: UserInfo) => {
  const [userId, setId, idError] = DataInput(/^[a-zA-z0-9]{5,20}$/);
  const [userName, setName, nameError] = DataInput(/^[ㄱ-ㅎ|가-힣]+$/);
  const [userPosition, setPosition, positionError] =
    DataInput(/^[ㄱ-ㅎ|가-힣]+$/);
  const [userPhoneNumber, setPhone, phoneError] = DataInput(
    /^([0-9]+)-([0-9]+)-([0-9]+)/
  );
  const [userPw, setPassword, pwdError] = DataInput(
    /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{9,16}$/
  );
  const [profile, setProfile] = useState<any | null>("");
  const [confirmPassword, setConfirmPassword, confirmPasswordError] =
    CheckPassword(userPw);
  const [fileName, setFileName] = useState("src/assets/admin/profile.png");

  const [users, setUsers] = useRecoilState(adminState);

  const [toastList, setToastList] = useRecoilState(toastListState);

  const saveProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(event.target.files[0]);
    setFileName(URL.createObjectURL(event.target.files[0]));
  };

  const submitRegist = () => {
    const user = {
      userId,
      userPw,
      userName,
      userPosition,
      userPhoneNumber,
    };
    const formData = new FormData();
    if (profile !== "") {
      formData.append("profile", profile);
    } else {
      formData.append("profile", "");
    }
    const userBlob = new Blob([JSON.stringify(user)], {
      type: "application/json",
    });

    formData.append("user", userBlob, "user.json");

    RegistUser(formData)
      .then((res) => {
        setUsers({ users: res.result });
        const successRegistToast = {
          type: "Success",
          sentence: "회원 가입에 성공했습니다.",
        };
        setToastList({ list: [...toastList.list, successRegistToast] });
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const nullError =
    !!userId && !!userName && !!userPhoneNumber && !!userPosition && !!userPw;
  const effectiveError =
    idError && pwdError && phoneError && positionError && pwdError;
  const submitError = nullError && effectiveError;

  return (
    <style.ModalBox>
      <style.ModalTitle>회원 등록 하기</style.ModalTitle>
      <style.ContentBox>
        <style.ProfileBox>
          <style.ProfileImage image={fileName}></style.ProfileImage>
          <style.SaveLabel htmlFor="file">
            {fileName !== "src/assets/admin/profile.png"
              ? "사진 교체"
              : "사진 업로드"}
          </style.SaveLabel>
          <style.SaveInput
            type="file"
            id="file"
            name="files"
            accept="image/png, image/jpg, image/jpeg"
            onChange={saveProfile}
            multiple
          />
        </style.ProfileBox>
        <style.DataBox>
          <InputLabel
            placeholder="아이디"
            width="100%"
            height="15%"
            value={userId}
            fontSize="1vw"
            onChange={setId}
            type="text"
            errorMessage={idError ? "" : "영어 숫자로만 입력해주세요 (5~20)"}
            errorFontSize="12px"
          />
          <InputLabel
            placeholder="이름"
            width="100%"
            height="15%"
            value={userName}
            fontSize="1vw"
            type="text"
            onChange={setName}
            errorMessage={nameError ? "" : "한글로만 입력해주세요"}
            errorFontSize="12px"
          />
          <InputLabel
            placeholder="직책"
            width="100%"
            height="15%"
            type="text"
            value={userPosition}
            fontSize="1vw"
            onChange={setPosition}
            errorMessage={positionError ? "" : "한글로만 입력해주세요"}
            errorFontSize="12px"
          />
          <InputLabel
            placeholder="전화번호( - 포함 작성 )"
            width="100%"
            height="15%"
            type="text"
            value={userPhoneNumber}
            fontSize="1vw"
            onChange={setPhone}
            errorMessage={phoneError ? "" : "전화번호 양식을 맞춰주세요"}
            errorFontSize="12px"
          />
          <InputLabel
            placeholder="비밀번호"
            width="100%"
            height="15%"
            type="password"
            value={userPw}
            fontSize="1vw"
            onChange={setPassword}
            errorMessage={
              pwdError ? "" : "숫자, 영어, 특수문자를 포함해 주세요(9~16)"
            }
            errorFontSize="12px"
          />
          <InputLabel
            placeholder="비밀번호 확인"
            width="100%"
            height="15%"
            type="password"
            value={confirmPassword}
            fontSize="1vw"
            onChange={setConfirmPassword}
            errorMessage={confirmPasswordError ? "" : "비밀번호와 다릅니다."}
            errorFontSize="12px"
          />
        </style.DataBox>
      </style.ContentBox>
      <style.SubmitButton>
        <AdminPrimaryButton
          content={"등록 하기"}
          isArrow={true}
          handler={submitRegist}
          disabled={!submitError}
        />
      </style.SubmitButton>
      <style.ChageModal onClick={handler}>로그인 하기</style.ChageModal>
    </style.ModalBox>
  );
};

export default SignUpModal;
