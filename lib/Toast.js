import { useToast } from 'native-base';

export default function ToastService() {
  const toast = useToast();

  const showToast = (message) => {
    toast.show({
      variant: 'left-accent',
      title: message,
      placement: 'bottom',
    });
  };

  return { showToast };
}
