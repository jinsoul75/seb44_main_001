import { AiFillDelete } from 'react-icons/ai';
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import deleteArticle from '../api/deleteArticle';
import { ArticleToGet } from '../../../common/type';
import { BASE_URL } from '../../../common/util/constantValue';
import getArticle from '../api/getArticle';
import { MdModeEditOutline } from 'react-icons/md';
import peach_on from '../../../common/assets/icons/peach_on.svg';
import comment from '../../../common/assets/icons/comment.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../../common/store/RootStore';

export default function Article() {
  const queryClient = useQueryClient();

  const userInfo = { memberId: 1 };

  const { id } = useParams();

  const navigate = useNavigate();

  const totalComments = useSelector((state: RootState) => state.totalComments);

  const { data }: UseQueryResult<ArticleToGet, unknown> = useQuery(
    ['getData', id],
    () => getArticle(`${BASE_URL}/posts/${id}`),
  );

  const deleteItemMutation = useMutation<void, unknown, void>(
    () => deleteArticle(`${BASE_URL}/posts/${id}/${userInfo.memberId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('filteredLists');
        navigate(-1);
      },
    },
  );

  const handleDelete = () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deleteItemMutation.mutate();
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
                ? `${data.editedAt.slice(0, 10)} (수정됨)`
                : data.createdAt.slice(0, 10)}
            </div>
          </TitleSection>
          <AuthorSection>
            <Link to={`/user/${data.memberId}`}>
              {/* 미니 모달 뜨게끔 수정해야함 */}
              <img
                src="https://avatars.githubusercontent.com/u/124570875?s=400&u=9d5e547ecc4366c617f03a86a2936afe509edba3&v=4"
                alt="user"
              />
              <div>나는 닉네임</div>
              {/* 위 유저 정보는 api 명세서 수정 후 수정 */}
            </Link>
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
              {userInfo.memberId === data?.memberId && (
                <Link to={`/write/${data?.postId}`}>
                  <MdModeEditOutline size={24} />
                </Link>
              )}
              {userInfo.memberId === data?.memberId && (
                <AiFillDelete size={24} onClick={handleDelete} />
              )}
              {/* 클릭 시 삭제 확인 창 뜨게 수정해야함 */}
            </div>
            <div>
              <div>
                <img src={peach_on} alt="liked" />
                <div>999</div>
              </div>
              <div>
                <img src={comment} alt="comment" />
                <div>{totalComments}</div>
              </div>
            </div>
            {/* 위 좋아요 수는 lv3 때 구현 */}
            {/* <div>{commenteData.pageInfo.totalElements}</div> */}
            {/* comment CRUD 구현 후 주석 해제 */}
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

  > a {
    display: flex;
    align-items: center;
    margin: 1rem 0 2rem 0;
    text-decoration: none;
    color: var(--color-black);

    & img {
      border-radius: 50%;
      height: 2rem;
      width: 2rem;
      margin-right: 1rem;
    }
  }
`;

const ContentSection = styled.section`
  margin-bottom: 2rem;
  min-height: 20rem;
`;

const TagSection = styled.section`
  display: flex;
  margin-bottom: 1rem;

  > div {
    margin-right: 1rem;
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