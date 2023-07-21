import { AiFillDelete } from 'react-icons/ai';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import deleteArticle from '../api/deleteArticle';
import { ArticleToGet } from '../../../common/type';
import { BASE_URL } from '../../../common/util/constantValue';
import { MdModeEditOutline } from 'react-icons/md';
import peach_on from '../../../common/assets/icons/peach_on.svg';
import peach_off from '../../../common/assets/icons/peach_off.svg';
import comment from '../../../common/assets/icons/comment.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../common/store/RootStore';
import { setCreatedPost } from '../../Write,Edit/store/CreatedPost';
import { setLocation } from '../../../common/store/LocationStore';
import { setCategory } from '../../../common/store/CategoryStore';
import { useState } from 'react';
import UserModal from './UserModal';
import profile from '../../../common/assets/profile.svg';
import { useEffect } from 'react';
import { calculateTimeDifference } from '../../../common/util/timeDifferenceCalculator';
import { postLike } from '../api/postLike';
import { deleteLike } from '../api/deleteLike';


export default function Article({ data }: { data?: ArticleToGet }) {
  const [isLiked, setIsLiked] = useState(false);

  const [totalLikes, setTotalLikes] = useState<number>(0);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const memberId = Number(localStorage.getItem('MemberId'));

  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const totalComments = useSelector((state: RootState) => state.totalComments);

  useEffect(() => {
    if (data) {
      setTotalLikes(data.postLikeCount ?? 0);
      setIsLiked(data.liked ?? false);
    }
  }, [data]);

  const postLikeMutaion = useMutation(
    () => {
      return postLike(`${BASE_URL}/likes/${id}/${memberId}`, {
        isLiked: !isLiked,
      });
    },
    {
      onSuccess: (responseData) => {
        console.log('조아요');
        setIsLiked(true);
        setTotalLikes(responseData.likeCount);
      },
      onError: (error) => {
        console.error('요청 실패:', error);
      },
    },
  );

  const deleteLikeMutation = useMutation(
    () => deleteLike(`${BASE_URL}/likes/${id}/${memberId}`),
    {
      onSuccess: (responseData) => {
        console.log('시러요');
        setIsLiked(false);
        setTotalLikes(responseData.likeCount);
      },
      onError: (error) => {
        console.error('요청 실패:', error);
      },
    },
  );

  const deleteItemMutation = useMutation<void, unknown, void>(
    () => deleteArticle(`${BASE_URL}/posts/${id}/${memberId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('filteredLists');
        navigate(-1);
      },
    },
  );

  const handleEditClick = () => {
    dispatch(
      setCreatedPost({
        title: data?.title,
        content: data?.content,
        tags: data?.tags,
        categoryId: data?.categoryInfo.categoryId,
        locationId: data?.locationInfo.locationId,
        memberId: data?.memberInfo.memberId,
      }),
    );
    dispatch(
      setLocation({
        locationId: data?.locationInfo.locationId,
        city: data?.locationInfo.city,
        province: data?.locationInfo.province,
      }),
    );
    dispatch(
      setCategory({
        name: data?.categoryInfo.name,
        categoryId: data?.categoryInfo.categoryId,
      }),
    );
  };

  const handleDelete = () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deleteItemMutation.mutate();
    }
  };

  const handleModalOpen = () => {
    setIsUserModalOpen(true);
  };

  const handleModalClose = () => {
    setIsUserModalOpen(false);
  };

  const handleClickLike = () => {
    if(!memberId){
      alert("로그인이 필요한 서비스입니다!")
      return;
    }else if (isLiked) {
      deleteLikeMutation.mutate();
    } else {
      postLikeMutaion.mutate();
    }
  };

  return (
    <Container>
      {data ? (
        <>
          <TitleSection>
            <div>{data.title}</div>
            <div>
              {data.editedAt
                ? `${calculateTimeDifference(data.editedAt)} (수정됨)`
                : calculateTimeDifference(data.createdAt)}
            </div>
          </TitleSection>
          <AuthorSection
            onMouseOver={handleModalOpen}
            onMouseOut={handleModalClose}
          >
            <img src={data.memberInfo.profileImage || profile} alt="user" />
            <div>{data.memberInfo.nickname}</div>
            <UserModal
              isUserModalOpen={isUserModalOpen}
              handleModalOpen={handleModalOpen}
              handleModalClose={handleModalClose}
              data={data}
            />
          </AuthorSection>
          <ContentSection>
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          </ContentSection>
          <TagSection>
            {data.tags.map((tag) => (
              <div key={tag}>{`#${tag}`}</div>
            ))}
          </TagSection>
          <InfoSection>
            <div>
              {memberId === data?.memberInfo.memberId && (
                <Link to={`/write/${data?.postId}`} onClick={handleEditClick}>
                  <MdModeEditOutline size={24} />
                </Link>
              )}
              {memberId === data?.memberInfo.memberId && (
                <AiFillDelete size={24} onClick={handleDelete} />
              )}
              {/* 클릭 시 삭제 확인 창 뜨게 수정해야함 */}
            </div>
            <div>
              <div>
                <Button type="button" onClick={handleClickLike}>
                  <img
                    src={isLiked ? `${peach_on}` : `${peach_off}`}
                    alt={isLiked ? 'Liked' : 'Not liked'}
                  />
                </Button>
                <div>{totalLikes}</div>
              </div>
              <div>
                <img src={comment} alt="comment" />
                <div>{totalComments}</div>
              </div>
            </div>
          </InfoSection>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </Container>
  );
}

const Container = styled.article`
  border: 2px solid var(--color-black);
  border-radius: 10px;
  padding: 2rem;
  width: 50rem;
  display: flex;
  flex-direction: column;
  background: var(--color-white);
  margin: 2rem 0 2rem 0;
  color: var(--color-black);
`;

const TitleSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: end;
  border-bottom: 1px solid var(--color-black);
  padding-bottom: 1rem;

  > :first-child {
    font-size: var(--font-size-m);
  }

  > :nth-child(2) {
    font-size: var(--font-size-xs);
  }
`;

const AuthorSection = styled.section`
  display: flex;
  align-items: center;
  margin: 1rem 0 2rem 0;
  text-decoration: none;
  color: var(--color-black);
  position: relative;
  width: fit-content;

  & img {
    border-radius: 50%;
    height: 2rem;
    width: 2rem;
    margin-right: 1rem;
  }

  > * {
    cursor: pointer;
  }
`;

const ContentSection = styled.section`
  margin-bottom: 2rem;
  min-height: 20rem;
  line-height: 1.5;
`;

const TagSection = styled.section`
  display: flex;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  > div {
    margin: 0 1rem 0.5rem 0;
    border-radius: 5px;
    background: var(--color-gray);
    padding: 0.5rem;
  }
`;

const InfoSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > :first-child {
    > a {
      margin-right: 1rem;
      display: flex;
      align-items: center;
      color: var(--color-black);
    }

    > :nth-child(2) {
      cursor: pointer;
    }
  }

  > :nth-child(2) {
    > div {
      margin-left: 1rem;

      > div {
        margin-left: 0.25rem;
      }
    }
  }
  & div {
    display: flex;
    align-items: center;
    font-size: 1rem;
  }

  & img {
    height: 1.5rem;
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  height: 24px;
  cursor: pointer;
`;
