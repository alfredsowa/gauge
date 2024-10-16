import { generateColors } from "@mantine/colors-generator";
import { Anchor, Button, Card, createTheme, Divider, InputLabel, Menu, Modal, Paper, rem, Table, Text } from "@mantine/core";

export const baseTheme = createTheme({
    fontFamily: 'Assistant',
    headings: { fontFamily: 'Lexend Deca, sans-serif' },
    components: {
      TableTh: Table.Th.extend({
        defaultProps: {
          fz: 'md',
          // py: '20px',
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
            'gauge-primary': generateColors('#50d962'),
            // 'gauge-primary': myColor,
          },
    fontSizes: {
      xs: rem(12),
      sm: rem(13),
      md: rem(15),
      lg: rem(18),
      xl: rem(22),
    },
  });