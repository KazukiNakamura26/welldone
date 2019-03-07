const _fb_errors = [
  { "code": 'auth/invalid-email', "message": 'メールアドレスの形式が不正です。' },
  { "code": 'auth/user-not-found', "message": 'メールアドレスかパスワードが間違っています。'}
]

export default {
  data() {
    return {
      errors: _fb_errors,
    }
  }
}
