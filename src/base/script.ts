import { generateColors } from "@mantine/colors-generator";
import { Anchor, Button, Card, createTheme, Divider, InputLabel, Menu, Modal, Paper, rem, Table, Text } from "@mantine/core";

export const baseTheme = createTheme({
    fontFamily: 'Public Sans',
    headings: { fontFamily: 'Public Sans, sans-serif' },
    components: {
      TableTh: Table.Th.extend({
        defaultProps: {
          fz: 'md',
          fw: 500,
        },
      }),
      MenuItem: Menu.Item.extend({
        defaultProps: {
          fz: 'md',
        },
      }),
      Anchor: Anchor.extend({
        defaultProps: {
          underline: 'never',
        },
      }),
      Divider: Divider.extend({
        defaultProps: {
          size: 'xs',
          // variant:"dashed"
        },
      }),
      Button: Button.extend({
        defaultProps: {
          size: 'md',
          fz: 'md',
          color: 'gauge-primary.9'
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
          size: 'md'
        },
      }),
      PasswordInput: Text.extend({
        defaultProps: {
          fz: 'md',
          fw: 400,
          size: 'md'
        },
      }),
      Select: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'md'
        },
      }),
      MultiSelect: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'md'
        },
      }),
      NumberInput: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'md'
        },
      }),
      Checkbox: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'md'
        },
      }),
      Textarea: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'md'
        },
      }),
      Switch: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'md'
        },
      }),
      Radio: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'md'
        },
      }),
      MonthPickerInput: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'md'
        },
      }),
      DateTimePicker: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'md'
        },
      }),
      DateInput: Text.extend({
        defaultProps: {
          fz: 'sm',
          fw: 400,
          size: 'md'
        },
      }),
      Modal: Modal.extend({
        defaultProps: {
          radius: 'lg',
          transitionProps:{
            transition: 'fade-down'
          }
        },
      }),
      Card: Card.extend({
        defaultProps: {
          radius: '7px',
          shadow: 'xs',
          withBorder: false
        },
      }),
      Paper: Paper.extend({
        defaultProps: {
          radius: '7px',
          // shadow: 'xs',
          // withBorder: false
        },
      }),
    },
    primaryColor: 'gauge-primary',
          colors: {
            'gauge-primary': generateColors('#045489FF'),
            // 'gauge-primary': myColor,
          },
    fontSizes: {
      xs: rem(11),
      sm: rem(12),
      md: rem(14),
      lg: rem(16),
      xl: rem(22),
    },
  });