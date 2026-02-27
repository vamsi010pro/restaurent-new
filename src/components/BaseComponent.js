import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import withRouter from './withRouter';
import { db } from '../services/firebase';
import "./BaseComp.css";

class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      codeData: "Loading... Please wait...",
    };
  }

  async componentDidMount() {
    const { id } = this.props.params;
    const { collectionName } = this.props;

    if (id && collectionName) {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.setState({ data: docSnap.data() });
      } else {
        this.props.navigate("/404");
      }
    }
  }

  render() {
    const { data } = this.state;

    if (!data) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "10vh" }}>
          {/* <Typography> </Typography> */}
          {/* <Typography>{this.state.codeData}</Typography> */}
          <div className="dot-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </Box>
      );
    }

    return (
      <>
        {this.props.render(data)}
      </>
    );
  }
}

export default withRouter(BaseComponent);
