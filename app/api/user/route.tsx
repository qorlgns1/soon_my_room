import { User } from '../../../types/user';

const kihoon: User = {
  id: 1,
  name: '배기훈',
  email: 'rlgns1129@naver.com',
  password: 'password',
};

export async function GET() {
  return Response.json({
    kihoon,
  });
}
