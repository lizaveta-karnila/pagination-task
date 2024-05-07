import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container, Pagination} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {usePathname, useSearchParams, useRouter} from "next/navigation";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
  usersCount: number
}

enum urlParamsNames {
  PAGE_NUMBER = 'page-number',
  PAGE_SIZE = 'page-size',
}

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 20;

export const getServerSideProps = (async ({query}: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const pageNumber = Number(query[urlParamsNames.PAGE_NUMBER])-1 || DEFAULT_PAGE_NUMBER-1;
    const pageSize = Number(query[urlParamsNames.PAGE_SIZE]) || DEFAULT_PAGE_SIZE;
    const res = await fetch(`http://localhost:3000/users?pageNumber=${pageNumber}&pageSize=${pageSize}`, { method: 'GET' })
    if (!res.ok) {
      return {props: {statusCode: res.status, users: [], usersCount: 0}}
    }

    const {users, usersCount} = await res.json();
    return {
      props: {statusCode: 200, users, usersCount}
    }
  } catch (e) {
    return {props: {statusCode: 500, users: [], usersCount: 0}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, users, usersCount}: TGetServerSideProps) {
  const DISPLAYED_PAGES_COUNT = 10;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPageNumber = Number(searchParams.get(urlParamsNames.PAGE_NUMBER)) || DEFAULT_PAGE_NUMBER;
  const currentPageSize = Number(searchParams.get(urlParamsNames.PAGE_SIZE)) || DEFAULT_PAGE_SIZE;
  const pagesCount = Math.ceil(usersCount/currentPageSize);

  function changeCurrentPageNumber(pageNumber: number) {
    const params = new URLSearchParams(searchParams);
    if (pageNumber) {
      params.set(urlParamsNames.PAGE_NUMBER, pageNumber.toString());
    } else {
      params.delete(urlParamsNames.PAGE_NUMBER);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First onClick={() => changeCurrentPageNumber(1)} disabled={currentPageNumber===1}/>
            <Pagination.Prev onClick={() => changeCurrentPageNumber(currentPageNumber-1)} disabled={currentPageNumber===1}/>
            {
              [...new Array(DISPLAYED_PAGES_COUNT)].map((_, i) => {
                const displayedPage = i + 1 + Math.floor((currentPageNumber - 1) / DISPLAYED_PAGES_COUNT) * DISPLAYED_PAGES_COUNT;
                return (
                  <Pagination.Item
                    key={i}
                    active={currentPageNumber===displayedPage}
                    onClick={() => changeCurrentPageNumber(displayedPage)}
                  >
                    {displayedPage}
                  </Pagination.Item>
                );
              })
            }
            <Pagination.Next onClick={() => changeCurrentPageNumber(currentPageNumber+1)} disabled={currentPageNumber===pagesCount}/>
            <Pagination.Last onClick={() => changeCurrentPageNumber(pagesCount)} disabled={currentPageNumber===pagesCount}/>
          </Pagination>
        </Container>
      </main>
    </>
  );
}
