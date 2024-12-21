//import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

//import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { useEffect, useState } from 'react';
import { User } from './types/User';
import { getUsers } from './api/users';
import { Loader } from './components/Loader';
import { PostsList } from './components/PostsList/PostsList';
import { Post } from './types/Post';
import { getPosts } from './api/posts';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [notification, setNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // #region load
  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setIsLoading(true);
      setPosts([]);
      setNotification('');

      getPosts(selectedUser.id)
        .then(res => {
          if (res.length === 0) {
            setNotification('is-warning');
          }

          setPosts(res);
        })
        .catch(() => setNotification('is-danger'))
        .finally(() => setIsLoading(false));
    }
  }, [selectedUser]);
  // #endregion

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector users={users} onSelect={setSelectedUser} />
              </div>

              <div className="block" data-cy="MainContent">
                {!isLoading && posts.length === 0 && !notification && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}
                {!isLoading && posts.length > 0 && <PostsList posts={posts} />}
                {isLoading && <Loader />}

                {notification === 'is-danger' && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {notification === 'is-warning' && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/*<div
          data-cy="Sidebar"
          className={classNames(
            'tile',
            'is-parent',
            'is-8-desktop',
            'Sidebar',
            'Sidebar--open',
          )}
        >
          <div className="tile is-child box is-success ">
            <PostDetails />
          </div>
          </div>*/}
        </div>
      </div>
    </main>
  );
};
