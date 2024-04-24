import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { Notifications } from '@/components/dashboard/settings/notifications';
import { UpdatePasswordForm } from '@/components/dashboard/settings/update-password-form';
import { UploadCsv } from '@/components/dashboard/settings/UploadCsv';

export const metadata = { title: `Csv Yükleme | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Csv Yükleme</Typography>
      </div>
      <UploadCsv />
    </Stack>
  );
}
