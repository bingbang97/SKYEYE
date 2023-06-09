import React, { useState, useEffect, memo } from "react";
import * as Style from "./Pictures.style";
import ButtonLayout from "@src/present/layout/ButtonLayout/ButtonLayout";
import SubTitle from "@src/present/common/SubTitle/SubTitle";
import { getCrackList } from "@src/action/api/Crack";
import { useLocation } from "react-router-dom";
import { getFolders, getPhotoList } from "@src/action/api/Pictures";
import PhotoLayout from "../PhotoLayout/PhotoLayout";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "@src/store/auth";
import {
  photoListState,
  crackListState,
  userFolderListState,
} from "@src/store/crack";

const AllPictures = () => {
  const location = useLocation().state;
  const [folder, setFolder] = useState<number | null>(null);
  const [crack, setCrack] = useState<string | null>(null);
  const userId = useRecoilValue(authState).user.userId;
  // List
  const [folderList, setFolderList] = useRecoilState(userFolderListState);
  const [crackList, setCrackList] = useRecoilState(crackListState);
  const [photoList, setPhotoList] = useRecoilState(photoListState);

  useEffect(() => {
    if (location !== null) {
      const dayOfWeek = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };
      getFolders(
        userId,
        [location[3], dayOfWeek[location[1]], location[2]].join("-")
      ).then((res) => {
        if (res.isSuccess) {
          setFolderList([...res.result]);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (folder !== null) {
      getCrackList(folder).then((res) => {
        if (res.isSuccess) {
          const keys = Object.keys(res.result).map((elem) => {
            return {
              crackType: res.result[elem].crackType,
              cnt: res.result[elem].countCrack,
            };
          });
          setCrackList(keys);
        }
      });
    }
  }, [folder, crack, photoList]);

  useEffect(() => {
    if (crack !== null) {
      getPhotoList(userId, folder, crack).then((res) => {
        if (res.isSuccess) {
          setPhotoList([...res.result]);
        }
      });
    }
  }, [crack]);

  // Handler
  const folderHandler = (idx: number) => {
    setFolder(folderList[idx].folderId);
  };

  const crackHandler = (type: string) => {
    setCrack(type);
  };

  // Sentence
  const guidence = () => {
    if (folder === null) {
      return (
        <>
          폴더를
          <br />
          선택해주세요
        </>
      );
    } else if (crack === null) {
      return (
        <>
          손상 유형을
          <br />
          선택해주세요
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <Style.Layout>
      <div>
        <SubTitle content="폴더명" />
        <ButtonLayout
          list={folderList}
          type={"folder"}
          selected={folder}
          handler={folderHandler}
        />
      </div>
      {folder !== null && (
        <div>
          <SubTitle content="균열 유형" />
          <ButtonLayout
            list={crackList}
            type={"crack"}
            selected={crack}
            handler={crackHandler}
          />
        </div>
      )}

      {crack !== null && (
        <div style={{ minWidth: "50%" }}>
          <SubTitle content="사진" />
          <PhotoLayout folder={folder} crack={crack} />
        </div>
      )}

      <Style.Guidence>{guidence()}</Style.Guidence>
    </Style.Layout>
  );
};

export default memo(AllPictures);
