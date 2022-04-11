import './App.css';
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import { useCallback } from "react";
import config from './config';

const fetcher = (url, token=config.token) => fetch(url, {
  method: 'GET',
  headers: { 'Authorization': token }
}).then((res) => res.json());

const useProject = (shouldFetch) => {
  const { data, error } = useSWR(
    shouldFetch ? `${config.API}/api/v1/project/projects/?total_records=true` : null,
    url => fetcher([url]),
    { refreshInterval: 1000 })

  return {
    data,
    isLoading: !error && !data,
    isError: error
  }
}

function App() {
  const { data, error } = useSWR(() =>
    [`${config.API}/api/v1/project/projects/recent/`, config.token],
    fetcher,
    // { refreshInterval: 1000 }
  );
  const projects = useProject(true);
  const { mutate } = useSWRConfig();

  // if (error) return "An error has occurred.";
  return (
    <div className='main'>
      <SWRConfig
        value={{
          refreshInterval: 3000,
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}>
        <div
          key='one'
          className='main-inner'>
          <button
            onClick={() => {
              mutate(`${config.API}/api/v1/project/projects/recent/`);
            }}
          >
            Mutate(Refresh on click)
          </button>

          {!data && "Loading..."}
          {data && data.map(item => {
            return (
              <div className='item-cont'>
                <div>project: <strong>{item.name}</strong></div>
                <p>totel: <strong>{item.progress.project_current_documents_count}</strong></p>
                <p>reviewed: <strong>{item.progress.project_reviewed_documents_count}</strong></p>
              </div>
            )
          })}
        </div>
        <div
          key='two'
          className='main-inner'>
          {!data && "Project Loading..."}
          {projects && projects.data && projects.data.data.map(item => {
            return (
              <div className='item-cont'>
              <div>project: <strong>{item.name}</strong></div>
            </div>
            )
          })}
        </div>
      </SWRConfig>
    </div>
  );
}

export default App;
