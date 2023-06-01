import React, { useMemo } from 'react';
import { Box, createTheme, ThemeProvider, Typography, Card} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import bjcp_data from './bjcp_styleguide-2021.json'


export type Style = {
  name: string;
  category: string;
  category_id: string;
  style_id: string;
  category_description: string;
  overall_impression: string;
  aroma: string;
  appearance: string;
  flavor: string;
  mouthfeel: string;
  comments: string;
  history: string;
  style_comparison: string;
  tags: string;
  original_gravity: Object;
  international_bitterness_units: Object;
  final_gravity: Object;
  alcohol_by_volume: Object;
  color: Object;
  ingredients: string;
  examples: string;
  style_guide: string;
  type: string;
  entry_instructions: string;
  notes: string;
  currently_defined_types: string;
  strength_classifications: string;
  accordingly: string;
  vital_statistics: string;
  impresion_general: string;
  aspecto: string;
  sabor: string;
  sensacion_en_boca: string;
  comentarios: string;
  historia: string;
  ingredientes: string;
  ejemplos_comerciales: string;
  impressao_geral: string;
  aparencia: string;
  sensacao_de_boca: string;
  comparacoes_de_estilo: string;
  exemplos_comerciais: string;
  marcacoes: string;
}

const BJCPVIEWER = () => {

  const columns = useMemo<MRT_ColumnDef<Style>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        enableGrouping: false, //do not let this column be grouped
      },
      {
        header: 'Category',
        accessorKey: 'category',
        size: 240,
      },
      {
        header: 'tags',
        accessorKey: 'tags',
        Cell: ({ row }) => <div className="text-wrap">{row.getValue("tags")}</div>, 
      },
      {
        header: 'examples',
        accessorKey: 'examples',
        Cell: ({ row }) => <div className="text-wrap">{row.getValue("examples")}</div>, 
      },
      {
        header: 'ingredients',
        accessorKey: 'ingredients',
        Cell: ({ row }) => <div className="text-wrap">{row.getValue("ingredients")}</div>, 
      },
    ],
    [],
  );

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    description: {
      fontSize: '1rem',
      padding: '0.2rem',
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#81980f',
    },
    secondary: {
      main: '#00bcd4',
     },
   },
 });

  function renderDescription(row, name) {
    if (name in row.original){
      return <Card><CardContent><Typography variant='h5'>{name}:</Typography><Typography variant="description"> {row.original[name]}</Typography></CardContent></Card>;
    }
    return ;
  }
  var descriptions = ["overall_impression", 'aroma', 'appearance', 'flavor', 'mouthfeel', 'comments', 'history', 'style_comparison', 'historia', ];

  return (
    <ThemeProvider theme={theme}>
    <MaterialReactTable
      columns={columns}
      data={bjcp_data.beerjson.styles}
      enablePagination={false}
      enableColumnResizing
      enableGrouping
      //enableStickyHeader
      //enableStickyFooter
      renderDetailPanel={({ row }) => (
        <Box
          sx={{
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
          }}
        >
          {descriptions.map((dname) => (renderDescription(row, dname)))}
          {/* <Card><CardContent><Typography variant='h5'>overall_impression:</Typography><Typography variant="description"> {row.original.overall_impression}</Typography></CardContent></Card>
          <Card><CardContent><Typography variant='h5'>aroma:</Typography><Typography variant="description"> {row.original.aroma}</Typography></CardContent></Card>
          <Card><CardContent><Typography variant='h5'>appearance:</Typography><Typography variant="description"> {row.original.appearance}</Typography></CardContent></Card>
          <Card><CardContent><Typography variant='h5'>flavor:</Typography><Typography variant="description"> {row.original.flavor}</Typography></CardContent></Card>
          <Card><CardContent><Typography variant='h5'>mouthfeel:</Typography><Typography variant="description"> {row.original.mouthfeel}</Typography></CardContent></Card>
          <Card><CardContent><Typography variant='h5'>comments:</Typography><Typography variant="description"> {row.original.comments}</Typography></CardContent></Card>
          <Card><CardContent><Typography variant='h5'>history:</Typography><Typography variant="description"> {row.original.history}</Typography></CardContent></Card>
          <Card><CardContent><Typography variant='h5'>style_comparison:</Typography><Typography variant="description"> {row.original.style_comparison}</Typography></CardContent></Card> */}
        </Box>
      )}
      layoutMode="grid"
      muiTableHeadCellProps={{
        sx: {
          flex: '0 0 auto',
        },
      }}
      muiTableBodyCellProps={{
        sx: {
          flex: '0 0 auto',
        },
      }}
      initialState={{
        density: 'compact',
        //expanded: false, //expand all groups by default
        grouping: ['category'], //an array of columns to group by by default (can be multiple)
        sorting: [{ id: 'category', desc: false }], //sort by state by default
      }}
      muiToolbarAlertBannerChipProps={{ color: 'primary' }}
    /></ThemeProvider>
  );
};

export default BJCPVIEWER;
