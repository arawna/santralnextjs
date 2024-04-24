'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  userName: zod.string().min(1, { message: 'Kullanıcı Adı Zorunludur' }),
  password: zod.string().min(6, { message: 'Şifre en az 6 karakter uzunluğunda olmalıdır' }),
  passwordRepead: zod.string().min(6, { message: 'Şifre en az 6 karakter uzunluğunda olmalıdır' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { userName: '', password: '', passwordRepead: '' } satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error } = await authClient.signUp(values);

      if(values.password !== values.passwordRepead){
        setError('root', { type: 'server', message: "Şifreler aynı olmalıdır" });
        setIsPending(false);
        return;
      }

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Kayıt Ol</Typography>
        <Typography color="text.secondary" variant="body2">
          Zaten hesabın var mı?{' '}
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            Giriş Yap
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="userName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.userName)}>
                <InputLabel>Kullanıcı Adı</InputLabel>
                <OutlinedInput {...field} label="Kullanıcı Adı" />
                {errors.userName ? <FormHelperText>{errors.userName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Şifre</InputLabel>
                <OutlinedInput {...field} label="Şifre" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="passwordRepead"
            render={({ field }) => (
              <FormControl error={Boolean(errors.passwordRepead)}>
                <InputLabel>Şifre Tekrar</InputLabel>
                <OutlinedInput {...field} label="Şifre Tekrar" type="password" />
                {errors.passwordRepead ? <FormHelperText>{errors.passwordRepead.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {/* <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <React.Fragment>
                      I have read the <Link>terms and conditions</Link>
                    </React.Fragment>
                  }
                />
                {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
              </div>
            )}
          /> */}
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Kayıt Ol
          </Button>
        </Stack>
      </form>
      {/* <Alert color="warning">Created users are not persisted</Alert> */}
    </Stack>
  );
}
