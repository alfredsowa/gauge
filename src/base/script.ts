import { generateColors } from "@mantine/colors-generator";
import { Anchor, Button, Card, createTheme, InputLabel, Modal, rem, Text } from "@mantine/core";

export const baseTheme = createTheme({
    fontFamily: 'Barlow',
    headings: { fontFamily: 'Poppins, sans-serif' },
    components: {
      Anchor: Anchor.extend({
        defaultProps: {
          underline: 'never',
        },
      }),
      Button: Button.extend({
        defaultProps: {
          size: 'md',
          // color: 'gauge-primary.9'
        },
      }),
      Text: Text.extend({
        defaultProps: {
          fz: 'md',
          fw: 400,
        },
      }),
      InputLabel: InputLabel.extend({
        defaultProps: {
          fz: 'md',
          fw: 400,
          c: 'dimmed'
        },
      }),
      TextInput: Text.extend({
        defaultProps: {
          fz: 'md',
          fw: 400,
          size: 'lg'
        },
      }),
      PasswordInput: Text.extend({
        defaultProps: {
          fz: 'md',
          fw: 400,
          size: 'lg'
        },
      }),
      Select: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'lg'
        },
      }),
      MultiSelect: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'lg'
        },
      }),
      NumberInput: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'lg'
        },
      }),
      Checkbox: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'lg'
        },
      }),
      Textarea: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'lg'
        },
      }),
      Switch: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'lg'
        },
      }),
      Radio: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'lg'
        },
      }),
      MonthPickerInput: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'lg'
        },
      }),
      DateTimePicker: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'lg'
        },
      }),
      DateInput: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'lg'
        },
      }),
      Modal: Modal.extend({
        defaultProps: {
          radius: 'lg',
        },
      }),
      Card: Card.extend({
        defaultProps: {
          radius: '14',
          shadow: 'xs',
          withBorder: false
        },
      }),
    },
    primaryColor: 'gauge-primary',
          colors: {
            'gauge-primary': generateColors('#50d962'),
            // 'gauge-primary': myColor,
          },
    fontSizes: {
      xs: rem(13),
      sm: rem(14),
      md: rem(16),
      lg: rem(17),
      xl: rem(20),
    },
  });