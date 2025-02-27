import Footer from "./Footer";
import NavBar from "./NavBar";

const TermsOfService = () => {
  return (
    <div className="term">
      <NavBar />
      <div className="main-content">
        <h1>服务条款</h1>
        <div className="term-item">
          <p>
            最后更新日期： 2025年2月13日
            <br />
            生效日期： 2025年2月13日
            <br />
            <i>
              本条款仅适用于个人兴趣项目，不构成法律建议。如果您需要专业合规方案，请咨询律师。
            </i>
          </p>
          <hr />
        </div>
        <div className="term-item">
          <h3>服务概述</h3>
          <p>
            本网站（以下简称“我们”或“本平台”）提供基于现代占星学的档案创建与分析服务。
            <br />
            本平台新增意见反馈功能，允许用户提交改进建议或问题报告。您可选择提供邮箱或微信号以便我们回复，但该功能并非紧急支持渠道，响应时间可能因资源限制而延迟。
          </p>
        </div>
        <div className="term-item">
          <h3>用户责任</h3>
          <p>
            <b>数据合法性：</b>
            如果您输入他人的出生时间或其他信息，需确保已获得其明确同意。
            <br />
            <b>账户安全：</b>
            您需妥善保管账户信息（如密码），并对账户下的所有活动负责。 <br />
            <b>反馈内容规范：</b>您通过反馈功能提交的内容不得包含：
            <ul>
              <li>垃圾广告、无关商业推广信息。</li>
              <li>侵犯他人隐私的第三方联系方式。</li>
              <li>恶意代码或诱导性链接。</li>
              <li>
                若您提供他人的联系方式（如代为反馈），需确保已获得其授权，并自行承担由此引发的责任。
              </li>
            </ul>
            <b>禁止行为：</b>您不得利用本服务从事以下行为：
            <ul>
              <li>发布虚假、违法或侵权内容。</li>
              <li>干扰或破坏本平台的正常运行。</li>
              <li>尝试未经授权的数据访问或篡改。</li>
            </ul>
          </p>
        </div>
        <div className="term-item">
          <h3>服务变更与终止</h3>
          <p>
            我们保留随时修改、暂停或终止服务的权利，恕不另行通知。
            <br />
            如果您违反本条款，我们有权立即终止您的账户访问权限。
          </p>
        </div>
        <div className="term-item">
          <h3>免责声明</h3>
          <p>
            <b>服务“按原样”提供：</b>
            我们不对服务的准确性、可靠性或适用性作任何明示或暗示的保证。
            <br />
            <b>本平台内容仅供参考：</b>
            本平台生成的内容仅供娱乐和个人兴趣使用，不构成任何专业建议（如医疗、金融或法律建议）。
            <br />
            <b>技术风险：</b>
            作为个人项目，我们无法保证服务的持续可用性或数据绝对安全。您理解并接受使用本服务的潜在风险。
            <br />
            <b>联系方式使用风险：</b>
            您理解并同意，通过反馈功能提供的微信号、邮箱等联系方式可能存在被未授权访问的风险，尽管我们已采取合理防护措施，但作为个人项目无法提供绝对安全保证。
            <br />
            <b>反馈内容处理：</b>
            我们可能基于改进服务的目的分析匿名化反馈数据，但不承诺采纳或实施任何具体建议。
          </p>
        </div>
        <div className="term-item">
          <h3>责任限制</h3>
          <p>
            在任何情况下，我们均不对因使用或无法使用本服务导致的直接、间接、特殊或后果性损害负责（包括但不限于数据丢失、利润损失或业务中断）。
          </p>
        </div>
        <div className="term-item">
          <h3>第三方链接</h3>
          <p>
            本网站可能包含指向第三方网站的链接。这些链接仅为方便用户提供，我们不对其内容或隐私实践负责。
          </p>
        </div>
        <div className="term-item">
          <h3>条款修改</h3>
          <p>
            我们保留随时修改本条款的权利。修改后的条款将在本页面公布，并在生效日期后对您具有约束力。继续使用服务即视为接受更新后的条款。
          </p>
        </div>
        <div className="term-item">
          <h3>联系我们</h3>
          <p>
            如有疑问，请通过
            <a href="mailto:astro.archive.contact@gmail.com">
              astro.archive.contact@gmail.com
            </a>
            与我们联系。
            <br />
            <b>请注意：</b>
            本网站为个人兴趣项目，无专业法律团队支持，回复可能延迟。
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
